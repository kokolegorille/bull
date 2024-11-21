// // Learn more about Tauri commands at https://tauri.app/develop/calling-rust/
// #[tauri::command]
// fn greet(name: &str) -> String {
//     format!("Hello, {}! You've been greeted from Rust!", name)
// }

// For time tracker
use serde::{Deserialize, Serialize};
use sysinfo::{Process, ProcessStatus, System};

// For video
use std::sync::mpsc;
use std::thread;

// TIME TRACKER

#[cfg(target_os = "macos")]
const APPLICATION_DIRS: &[&str] = &["/Applications", "/Users/*/Applications"];

#[cfg(target_os = "windows")]
const APPLICATION_DIRS: &[&str] = &["C:\\Program Files", "C:\\Program Files (x86)"];

#[cfg(target_os = "linux")]
const APPLICATION_DIRS: &[&str] = &["/usr/bin", "/usr/local/bin", "/opt"];

#[derive(Serialize, Deserialize)]
struct AppInfo {
  id: String,
  name: String,
  running_time_formatted: String,
  memory_in_bytes: u64,
}

fn is_valid(process: &Process) -> bool {
  let helper_keywords = vec!["helper", "service", "daemon", "agent", "."];

  if let Some(exe_path) = process.exe().unwrap().to_str() {
    let is_in_app_dir = APPLICATION_DIRS.iter()
      .any(|dir| exe_path.starts_with(dir));

    let is_helper = helper_keywords.iter().any(|keyword|
    process.name().to_string_lossy().to_ascii_lowercase().contains(keyword));

    process.status() == ProcessStatus::Run && is_in_app_dir && !is_helper
  } else {
    false
  }
}

fn format_running_time(seconds: u64) -> String {
  let days = seconds / 86400;
  let hours = (seconds % 86400) / 3600;
  let minutes = (seconds % 3600) / 60;
  let seconds = seconds % 60;

  format!("{:02} Days : {:02}:{:02}:{:02}", days, hours, minutes, seconds)
}

#[tauri::command]
fn max_running_process() -> Option<AppInfo> {
  let mut sys = System::new_all();
  sys.refresh_all();
  
  sys.processes()
    .iter()
    .filter(|(_, process)| is_valid(process))
    .max_by_key(|(_, process)| process.run_time())
    .map(|(id, process)| {
      AppInfo {
        id: id.to_string(),
        name: process.name().to_string_lossy().into_owned(),
        running_time_formatted: format_running_time(process.run_time()),
        memory_in_bytes: process.memory()
      }
    })
}

#[tauri::command]
fn max_memory() -> Option<AppInfo> {
  let mut sys = System::new_all();
  sys.refresh_all();

  sys.processes()
    .iter()
    .filter(|(_, process)| is_valid(process))
    .max_by_key(|(_, process)| process.memory())
    .map(|(id, process)| {
      AppInfo {
        id: id.to_string(),
        name: process.name().to_string_lossy().into_owned(),
        running_time_formatted: format_running_time(process.run_time()),
        memory_in_bytes: process.memory()
      }
    })
}

#[tauri::command]
fn list_process() -> Vec<AppInfo> {
  let mut sys = System::new_all();
  sys.refresh_all();

  let mut processes: Vec<AppInfo> = sys.processes()
    .iter()
    .filter(|(_, process)| is_valid(process))
    .map(|(id, process)| {
      AppInfo {
        id: id.to_string(),
        name: process.name().to_string_lossy().into_owned(),
        running_time_formatted: format_running_time(process.run_time()),
        memory_in_bytes: process.memory()
      }
    })
    .collect();

  processes.sort_by(|a, b| a.name.to_lowercase().cmp(&b.name.to_lowercase()));

  processes
}

// VIDEO

#[tauri::command]
fn process_file_chunk(chunk: Vec<u8>, chunk_index: usize, total_chunks: usize, file_name: String) {
    // Simulate using channels to handle chunks
    let (sender, receiver) = mpsc::channel();

    // Spawn a new thread to process the data
    thread::spawn(move || {
        // Send the chunk data through the channel
        sender.send((chunk, chunk_index)).expect("Failed to send chunk");

        // Receive and process each chunk
        for (_chunk_data, index) in receiver {
            println!("Processing chunk {}/{} of file: {}", index + 1, total_chunks, file_name);
            // Here, you can handle each chunk (e.g., write to a file, process data, etc.)
        }
    });
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
  tauri::Builder::default()
    .plugin(tauri_plugin_shell::init())
    // .invoke_handler(tauri::generate_handler![greet])
    .invoke_handler(tauri::generate_handler![
      list_process, max_memory, max_running_process,
      process_file_chunk
    ])
    .run(tauri::generate_context!())
    .expect("error while running tauri application");
}
