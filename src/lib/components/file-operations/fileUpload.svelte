<script lang="ts">
    export let onFileUpload: (content: string) => void;
    import {
		
		addCourse,
		deleteCourse,
		
		importCourseData,
		openCourse
	} from '$lib/../store';

    const handleFileUpload = async (e: Event) => {
        const target = e.target as HTMLInputElement;
        if (!target.files?.length) return;
        const file = target.files[0];
        const content = await file.text();
        onFileUpload(content); // Emit the file content to the parent component
        target.value = ''; // Reset the input
    };
</script>

<div class="file-upload">
    
    <p>

        
        <!-- <label for="fileUpload" class="link inline-block cursor-pointer bg-green-100 p-4 rounded">📁 Upload File -->
        
        <label for="fileUpload" class="create-course-button">📁 Upload File
            
            <input
                id="fileUpload"
                class="hidden"
                type="file"
                accept="application/json"
                on:change={handleFileUpload}
            />
        </label>
    </p>
</div>

<style>
    .file-upload {
        text-align: center;
    }
    .link {
        color: blue;
        text-decoration: underline;
        cursor: pointer;
    }
    .hidden {
        display: none;
    }


    /* Button for creating a course */
    .create-course-button {
        background-color: #4caf50;
        color: white;
        border: none;
        padding: 1rem 2rem;
        border-radius: 8px;
        font-size: 1.2rem;
        cursor: pointer;
        display: flex;
        align-items: center;
        gap: 0.5rem;
        transition: background-color 0.3s ease;
    }

    .create-course-button:hover {
        background-color: #45a049;
    }

    /* Icon and text alignment */
    .icon-text {
        display: flex;
        align-items: center;
        gap: 0.5rem;
    }

    /* File upload section */
    .file-upload {
        margin-top: 1rem;
        font-size: 0.9rem;
        color: #555;
    }

    .file-upload-label {
        color: #4caf50;
        text-decoration: underline;
        cursor: pointer;
    }

    .file-input {
        display: none; /* Hide the file input */
    }
</style>