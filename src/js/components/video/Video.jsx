import { useEffect, useState } from "react"
import { invoke } from "@tauri-apps/api/core"

const Video = () => {
    const [video, setVideo] = useState(null)

    const handleFileChange = e => {
        console.log("ON CHANGE")
        const file = e.target.files?.item(0)
        console.log("FILE : ", file)

        if (file) {
            setVideo(file)

            const chunkSize = 1024 * 1024 // 1 MB per chunk
            const totalChunks = Math.ceil(file.size / chunkSize)
            let currentChunk = 0

            const readNextChunk = () => {
                if (currentChunk < totalChunks) {
                    const start = currentChunk * chunkSize
                    const end = Math.min(start + chunkSize, file.size)
                    const blob = file.slice(start, end)

                    const reader = new FileReader()
                    reader.onload = async (e) => {
                        const chunkContent = e.target.result

                        try {
                            // Send the chunk to the Rust backend
                            await invoke('process_file_chunk', {
                                chunk: Array.from(new Uint8Array(chunkContent)), // Convert ArrayBuffer to Uint8Array
                                chunkIndex: currentChunk,
                                totalChunks,
                                fileName: file.name,
                            })
                            currentChunk++
                            readNextChunk() // Read the next chunk
                        } catch (error) {
                            console.error('Error sending chunk to Rust:', error)
                        }
                    }

                    reader.readAsArrayBuffer(blob) // Read the chunk as ArrayBuffer
                } else {
                    console.log('All chunks have been sent!')
                }
            }

            // Start reading the first chunk
            readNextChunk()
        }
    }

    useEffect(() => {
        if (video) {
            console.log("VIDEO : ", video)
        }
    }, [video])

    return (
        <main className="container">
            <input
                onChange={handleFileChange}
                type="file"
                accept="video/*" />
            {
                video &&
                <video controls width="650" src={URL.createObjectURL(video)} />
            }
        </main>
    );
}

export default Video;

// // import { useEffect, useState } from "react"
// import React from "react"
// import { useForm } from "react-hook-form"

// const Video = () => {
//     const {
//         register,
//         handleSubmit,
//         watch,
//         formState: { _errors },
//     } = useForm()

//     const onSubmit = data => console.log(data)

//     console.log(watch("media"))

//     //   const [video, setVideo] = useState(null)

//     //   const handleFileChange = e => {
//     //     console.log("ON CHANGE")
//     //     const file = e.target.files?.item(0)
//     //     console.log("FILE : ", file)

//     //     setVideo(file)
//     //   }

//     // useEffect(() => {
//     //     if (video) {
//     //         console.log("VIDEO : ", video)
//     //     }
//     // }, [video])

//     return (
//         <main className="container">
//             <form onSubmit={handleSubmit(onSubmit)}>
//                 <input
//                     {...register("media")}
//                     type="file"
//                     accept="video/*" />

//                 <input type="submit" />
//             </form>

//         </main>
//     );
// }

// export default Video;