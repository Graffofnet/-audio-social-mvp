// Подключение к Supabase
const SUPABASE_URL = 'https://nhdushhpqmtbzmgjyqoe.supabase.co';
const SUPABASE_KEY = 'sb_publishable_JVD0JSEr8TmWWu5eglHzKQ_394cuN1P';

let supabase = null;

// Загружаем библиотеку Supabase
async function loadSupabase() {
    if (typeof window.supabase === 'undefined') {
        await new Promise((resolve, reject) => {
            const script = document.createElement('script');
            script.src = 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2';
            script.onload = resolve;
            script.onerror = reject;
            document.head.appendChild(script);
        });
    }
    supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY);
}

// Вызываем загрузку при старте
loadSupabase().then(() => {
    console.log('Supabase подключен!');
    // Дальше будем добавлять функции
});
// app.js
const recordBtn = document.getElementById('recordBtn');
const stopBtn = document.getElementById('stopBtn');
const audioPlayer = document.getElementById('audioPlayer');

let mediaRecorder;
let audioChunks = [];

recordBtn.addEventListener('click', async () => {
    try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        mediaRecorder = new MediaRecorder(stream);
        audioChunks = [];

        mediaRecorder.ondataavailable = (event) => {
            audioChunks.push(event.data);
        };

        mediaRecorder.onstop = () => {
            const audioBlob = new Blob(audioChunks, { type: 'audio/webm' });
            const audioUrl = URL.createObjectURL(audioBlob);
            audioPlayer.src = audioUrl;
            stream.getTracks().forEach(track => track.stop());
        };

        mediaRecorder.start();
        recordBtn.disabled = true;
        stopBtn.disabled = false;
    } catch (error) {
        alert('Доступ к микрофону запрещен, братан. Разрешите доступ в настройках браузера.');
    }
});

stopBtn.addEventListener('click', () => {
    mediaRecorder.stop();
    recordBtn.disabled = false;
    stopBtn.disabled = true;
});
