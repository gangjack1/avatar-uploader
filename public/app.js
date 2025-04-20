document.addEventListener('DOMContentLoaded', () => {
    // Your new Supabase credentials
    const supabase = window.supabase.createClient(
        'https://zrgvjubtjopdvmupxvus.supabase.co',  // New URL
        'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpyZ3ZqdWJ0am9wZHZtdXB4dnVzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDUxMzM3NzUsImV4cCI6MjA2MDcwOTc3NX0.LMUI0Eyj6nyDNcmE1T4RXJjL_9Rt3BiN8iBV4C01nB4'  // New Anon Key
    );

    const form = document.getElementById('avatar-upload-form');
    const selfieInput = document.getElementById('selfie-upload');
    const voiceInput = document.getElementById('voice-upload');
    const submitButton = document.getElementById('submit-button');

    // Form validation
    function checkValidity() {
        submitButton.disabled = !(selfieInput.files.length && voiceInput.files.length);
    }

    // Selfie preview
    selfieInput.addEventListener('change', (e) => {
        if (e.target.files[0]) {
            const reader = new FileReader();
            reader.onload = (e) => {
                document.getElementById('selfie-preview').src = e.target.result;
                document.getElementById('selfie-preview').style.display = 'block';
            };
            reader.readAsDataURL(e.target.files[0]);
            checkValidity();
        }
    });

    // Voice preview
    voiceInput.addEventListener('change', (e) => {
        if (e.target.files[0]) {
            const reader = new FileReader();
            reader.onload = (e) => {
                document.getElementById('audio-preview').src = e.target.result;
                document.getElementById('audio-preview').style.display = 'block';
            };
            reader.readAsDataURL(e.target.files[0]);
            checkValidity();
        }
    });

    // Form submission
    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        try {
            // Hide form, show progress
            form.style.display = 'none';
            document.getElementById('upload-progress').style.display = 'block';
            
            // Upload files
            const userId = 'user_' + Date.now();
            const selfieFile = selfieInput.files[0];
            const voiceFile = voiceInput.files[0];
            
            // Upload selfie
            await supabase.storage.from('avatars').upload(
                `${userId}_selfie.${selfieFile.name.split('.').pop()}`,
                selfieFile
            );
            
            // Upload voice
            await supabase.storage.from('voices').upload(
                `${userId}_voice.${voiceFile.name.split('.').pop()}`,
                voiceFile
            );
            
            // Show success
            document.getElementById('success-message').style.display = 'block';
            
            // Reset form after 2 seconds
            setTimeout(() => {
                form.reset();
                document.getElementById('selfie-preview').style.display = 'none';
                document.getElementById('audio-preview').style.display = 'none';
                document.getElementById('success-message').style.display = 'none';
                form.style.display = 'block';
            }, 2000);

        } catch (error) {
            alert('Upload failed. Check console.');
            console.error(error);
            form.style.display = 'block';
            document.getElementById('upload-progress').style.display = 'none';
        }
    });
});