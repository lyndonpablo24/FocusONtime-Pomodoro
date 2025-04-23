let timer;
let timeLeft = 25 * 60;
let running = false;
let workDuration = 25 * 60;
let breakDuration = 5 * 60;
let isWorkSession = true;
let pomodoroCount = 0;

// 🎵 Audio Elements
let music = document.getElementById("background-music");
let alarm = document.getElementById("alarm-sound");
music.loop = true;
alarm.loop = false; // Alarm plays once

// 🔊 Toggle Music Slider & Play/Pause
function toggleMusicSlider() {
    let slider = document.getElementById("music-volume");
    slider.classList.toggle("hidden");

    if (!slider.classList.contains("hidden")) {
        if (music.paused) {
            music.play();
        } else {
            music.pause();
        }
    }
}

// 🎚 Adjust Music Volume
document.getElementById("music-volume").addEventListener("input", function () {
    music.volume = this.value;
    if (this.value == 0) {
        music.pause();
    } else {
        music.play();
    }
});

// 🔔 Toggle Alarm Slider
function toggleAlarmSlider() {
    let slider = document.getElementById("alarm-volume");
    slider.classList.toggle("hidden");
}

// 🎚 Adjust Alarm Volume
document.getElementById("alarm-volume").addEventListener("input", function () {
    alarm.volume = this.value;
});

// 🕒 Update Timer Display
function updateDisplay() {
    let minutes = Math.floor(timeLeft / 60);
    let seconds = timeLeft % 60;
    document.getElementById("timer").innerText = `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
}

// ▶ Start Timer
function startTimer() {
    if (!running) {
        running = true;
        timer = setInterval(() => {
            if (timeLeft > 0) {
                timeLeft--;
                updateDisplay();
            } else {
                clearInterval(timer);
                running = false;
                isWorkSession = !isWorkSession;
                timeLeft = isWorkSession ? workDuration : breakDuration;

                // 🔔 Alarm: Pause music, play alarm, resume after
                music.pause();
                alarm.currentTime = 0;
                alarm.play();

                alarm.onended = function () {
                    if (!document.getElementById("music-volume").classList.contains("hidden")) {
                        music.play();
                    }
                };

                if (!isWorkSession) pomodoroCount++;
                document.getElementById("pomodoro-count").innerText = pomodoroCount;
                updateDisplay();
                startTimer();
            }
        }, 1000);
    }
}

// ⏸ Pause & Reset Timer
function pauseTimer() {
    clearInterval(timer);
    running = false;
}

function resetTimer() {
    clearInterval(timer);
    running = false;
    timeLeft = workDuration;
    updateDisplay();
}

// 🔄 Set Custom Time
function setCustomTime() {
    workDuration = document.getElementById("work-time").value * 60;
    breakDuration = document.getElementById("break-time").value * 60;
    timeLeft = workDuration;
    updateDisplay();
}

// 🌙 Toggle Dark/Light Mode
function toggleTheme() {
    document.body.classList.toggle("dark-mode");
}

// 🔔 Pause timer & music on tab change + alert or notify
document.addEventListener("visibilitychange", function () {
    if (document.hidden) {
        pauseTimer();
        music.pause();

        // Try web notification first
        if ("Notification" in window && Notification.permission === "granted") {
            new Notification("⏸ Pomodoro Paused", {
                body: "You left the site. Timer and music have stopped.",
            });
        } else {
            // Fallback alert
            alert("⏸ Pomodoro Paused: You left the tab, so the timer and music were stopped.");
        }
    }
});

// 🔔 Request Notification Permission on Page Load
document.addEventListener("DOMContentLoaded", function () {
    if (Notification.permission !== "granted" && Notification.permission !== "denied") {
        Notification.requestPermission();
    }
});

// 📝 Add Task with Completion Toggle and Delete Button
function addTask() {
    const taskInput = document.getElementById("task-input");
    const taskText = taskInput.value.trim();
    if (taskText === "") return;

    const li = document.createElement("li");
    li.textContent = taskText;

    // Toggle completion
    li.addEventListener("click", function () {
        li.classList.toggle("completed");
    });

    // Delete button
    const deleteBtn = document.createElement("button");
    deleteBtn.textContent = "❌";
    deleteBtn.style.marginLeft = "10px";
    deleteBtn.style.background = "transparent";
    deleteBtn.style.border = "none";
    deleteBtn.style.cursor = "pointer";
    deleteBtn.addEventListener("click", function (e) {
        e.stopPropagation();
        li.remove();
    });

    li.appendChild(deleteBtn);
    document.getElementById("task-list").appendChild(li);
    taskInput.value = "";
}
