/**
 * Enhanced Rich Text Editor Initialization using TipTap
 * Features: Images, Videos, Code Blocks, Links, Tables, Text Formatting, Colors, Alignment
 */

import { Editor } from '@tiptap/core';
import StarterKit from '@tiptap/starter-kit';
import { Image } from '@tiptap/extension-image';
import { Link } from '@tiptap/extension-link';
import { CodeBlockLowlight } from '@tiptap/extension-code-block-lowlight';
import { Underline } from '@tiptap/extension-underline';
import { TextAlign } from '@tiptap/extension-text-align';
import { TextStyle } from '@tiptap/extension-text-style';
import { Color } from '@tiptap/extension-color';
import { Highlight } from '@tiptap/extension-highlight';
import { Table } from '@tiptap/extension-table';
import { TableRow } from '@tiptap/extension-table-row';
import { TableHeader } from '@tiptap/extension-table-header';
import { TableCell } from '@tiptap/extension-table-cell';
import { HorizontalRule } from '@tiptap/extension-horizontal-rule';
import { Youtube } from '@tiptap/extension-youtube';
import { createLowlight } from 'lowlight';

// Import languages for syntax highlighting
import javascript from 'highlight.js/lib/languages/javascript';
import typescript from 'highlight.js/lib/languages/typescript';
import python from 'highlight.js/lib/languages/python';
import html from 'highlight.js/lib/languages/xml';
import css from 'highlight.js/lib/languages/css';
import json from 'highlight.js/lib/languages/json';
import bash from 'highlight.js/lib/languages/bash';

// Create lowlight instance and register languages
const lowlight = createLowlight();
lowlight.register('javascript', javascript);
lowlight.register('typescript', typescript);
lowlight.register('python', python);
lowlight.register('html', html);
lowlight.register('css', css);
lowlight.register('json', json);
lowlight.register('bash', bash);

let editor: Editor | null = null;

export function initRichTextEditor(initialContent: string = ''): Editor {
  const editorElement = document.getElementById('editor-content');
  const hiddenTextarea = document.getElementById('blog-content-html') as HTMLTextAreaElement;

  if (!editorElement) {
    throw new Error('Editor container not found');
  }

  // Initialize TipTap editor with all extensions
  editor = new Editor({
    element: editorElement,
    extensions: [
      StarterKit.configure({
        codeBlock: false, // We'll use CodeBlockLowlight instead
      }),
      Underline,
      TextAlign.configure({
        types: ['heading', 'paragraph'],
      }),
      TextStyle,
      Color,
      Highlight.configure({
        multicolor: true,
      }),
      Image.configure({
        inline: true,
        allowBase64: true,
        HTMLAttributes: {
          class: 'editor-image',
          loading: 'lazy',
        },
      }),
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          rel: 'noopener noreferrer',
          target: '_blank',
        },
      }),
      CodeBlockLowlight.configure({
        lowlight,
        defaultLanguage: 'javascript',
      }),
      Table.configure({
        resizable: true,
        HTMLAttributes: {
          class: 'editor-table',
        },
      }),
      TableRow,
      TableHeader,
      TableCell,
      HorizontalRule,
      Youtube.configure({
        controls: true,
        nocookie: true,
        width: 640,
        height: 360,
      }),
    ],
    content: initialContent,
    onUpdate: ({ editor }) => {
      // Update hidden textarea whenever content changes
      if (hiddenTextarea) {
        hiddenTextarea.value = editor.getHTML();
      }
      // Update character and word counts
      updateCounts(editor);
    },
    editorProps: {
      attributes: {
        class: 'prose prose-sm max-w-none focus:outline-none',
      },
    },
  });

  // Set up toolbar buttons
  setupToolbar(editor);

  // Update hidden textarea with initial content
  if (hiddenTextarea) {
    hiddenTextarea.value = editor.getHTML();
  }

  // Initialize counts
  updateCounts(editor);

  return editor;
}

function updateCounts(editor: Editor) {
  const text = editor.getText();
  const charCount = text.length;
  const wordCount = text.trim().split(/\s+/).filter(w => w).length;
  
  const charCountEl = document.getElementById('char-count');
  const wordCountEl = document.getElementById('word-count');
  
  if (charCountEl) {
    charCountEl.textContent = `${charCount} characters`;
  }
  if (wordCountEl) {
    wordCountEl.textContent = `${wordCount} words`;
  }
}

function setupToolbar(editor: Editor) {
  // Get all toolbar buttons
  const buttons = document.querySelectorAll('.editor-btn');

  buttons.forEach((button) => {
    const command = button.getAttribute('data-command');
    const level = button.getAttribute('data-level');

    if (!command) return;

    button.addEventListener('click', (e) => {
      e.preventDefault();
      handleToolbarCommand(editor, command, level);
    });

    // Update active state for formatting buttons
    const activeCommands = ['bold', 'italic', 'underline', 'strike', 'bulletList', 'orderedList', 'blockquote', 'codeBlock'];
    if (activeCommands.includes(command)) {
      editor.on('selectionUpdate', () => {
        updateButtonState(button as HTMLElement, editor, command);
      });
      editor.on('transaction', () => {
        updateButtonState(button as HTMLElement, editor, command);
      });
    }

    // Update active state for headings
    if (command === 'heading' && level) {
      editor.on('selectionUpdate', () => {
        const isActive = editor.isActive('heading', { level: parseInt(level) });
        button.classList.toggle('is-active', isActive);
      });
      editor.on('transaction', () => {
        const isActive = editor.isActive('heading', { level: parseInt(level) });
        button.classList.toggle('is-active', isActive);
      });
    }

    // Update active state for alignments
    if (command === 'textAlign') {
      const alignment = button.getAttribute('data-alignment');
      if (alignment) {
        editor.on('selectionUpdate', () => {
          const isActive = editor.isActive({ textAlign: alignment });
          button.classList.toggle('is-active', isActive);
        });
        editor.on('transaction', () => {
          const isActive = editor.isActive({ textAlign: alignment });
          button.classList.toggle('is-active', isActive);
        });
      }
    }
  });
}

function updateButtonState(button: HTMLElement, editor: Editor, command: string) {
  const isActive = editor.isActive(command);
  button.classList.toggle('is-active', isActive);
}

async function handleToolbarCommand(editor: Editor, command: string, level?: string | null) {
  switch (command) {
    case 'bold':
      editor.chain().focus().toggleBold().run();
      break;
    case 'italic':
      editor.chain().focus().toggleItalic().run();
      break;
    case 'underline':
      editor.chain().focus().toggleUnderline().run();
      break;
    case 'strike':
      editor.chain().focus().toggleStrike().run();
      break;
    case 'heading':
      if (level) {
        editor.chain().focus().toggleHeading({ level: parseInt(level) as 1 | 2 | 3 }).run();
      }
      break;
    case 'bulletList':
      editor.chain().focus().toggleBulletList().run();
      break;
    case 'orderedList':
      editor.chain().focus().toggleOrderedList().run();
      break;
    case 'blockquote':
      editor.chain().focus().toggleBlockquote().run();
      break;
    case 'codeBlock':
      editor.chain().focus().toggleCodeBlock().run();
      break;
    case 'link':
      await handleInsertLink(editor);
      break;
    case 'image':
      await handleInsertImage(editor);
      break;
    case 'video':
      await handleInsertVideo(editor);
      break;
    case 'textAlign':
      const alignment = (event?.target as HTMLElement)?.closest('[data-alignment]')?.getAttribute('data-alignment');
      if (alignment) {
        editor.chain().focus().setTextAlign(alignment).run();
      }
      break;
    case 'textColor':
      await handleTextColor(editor);
      break;
    case 'highlightColor':
      await handleHighlightColor(editor);
      break;
    case 'table':
      editor.chain().focus().insertTable({ rows: 3, cols: 3, withHeaderRow: true }).run();
      break;
    case 'deleteTable':
      editor.chain().focus().deleteTable().run();
      break;
    case 'addRowBefore':
      editor.chain().focus().addRowBefore().run();
      break;
    case 'addRowAfter':
      editor.chain().focus().addRowAfter().run();
      break;
    case 'addColumnBefore':
      editor.chain().focus().addColumnBefore().run();
      break;
    case 'addColumnAfter':
      editor.chain().focus().addColumnAfter().run();
      break;
    case 'deleteRow':
      editor.chain().focus().deleteRow().run();
      break;
    case 'deleteColumn':
      editor.chain().focus().deleteColumn().run();
      break;
    case 'horizontalRule':
      editor.chain().focus().setHorizontalRule().run();
      break;
    case 'undo':
      editor.chain().focus().undo().run();
      break;
    case 'redo':
      editor.chain().focus().redo().run();
      break;
  }
}

async function handleInsertLink(editor: Editor) {
  const previousUrl = editor.getAttributes('link').href;
  const url = window.prompt('Enter URL:', previousUrl || 'https://');

  if (url === null) {
    return; // User cancelled
  }

  if (url === '') {
    // Remove link
    editor.chain().focus().extendMarkRange('link').unsetLink().run();
    return;
  }

  // Update link
  editor.chain().focus().extendMarkRange('link').setLink({ href: url }).run();
}

async function handleInsertImage(editor: Editor) {
  // Show image upload modal
  const modal = document.getElementById('image-upload-modal');
  if (modal) {
    modal.classList.remove('hidden');
    setupImageUploadModal(editor);
  } else {
    // Fallback to simple prompt if modal not found
    const url = window.prompt('Enter image URL:', 'https://');
    if (url && url !== 'https://') {
      const altText = window.prompt('Enter alt text for accessibility (optional):', '');
      editor.chain().focus().setImage({ src: url, alt: altText || '' }).run();
    }
  }
}

function setupImageUploadModal(editor: Editor) {
  const modal = document.getElementById('image-upload-modal')!;
  const uploadTab = document.getElementById('upload-tab')!;
  const urlTab = document.getElementById('url-tab')!;
  const uploadSection = document.getElementById('upload-section')!;
  const urlSection = document.getElementById('url-section')!;
  const fileInput = document.getElementById('image-file-input') as HTMLInputElement;
  const insertBtn = document.getElementById('insert-image-btn')!;
  const cancelBtn = document.getElementById('cancel-image-btn')!;
  const previewContainer = document.getElementById('image-preview-container')!;
  const preview = document.getElementById('image-preview') as HTMLImageElement;
  const fileSizeInfo = document.getElementById('file-size-info')!;

  let currentMode = 'upload';
  let uploadedImageUrl = '';
  let selectedFile: File | null = null;

  // Tab switching
  uploadTab.addEventListener('click', () => {
    currentMode = 'upload';
    uploadTab.classList.add('bg-blue-600', 'text-white');
    uploadTab.classList.remove('bg-gray-200', 'dark:bg-gray-700', 'text-gray-900', 'dark:text-white');
    urlTab.classList.remove('bg-blue-600', 'text-white');
    urlTab.classList.add('bg-gray-200', 'dark:bg-gray-700', 'text-gray-900', 'dark:text-white');
    uploadSection.classList.remove('hidden');
    urlSection.classList.add('hidden');
  });

  urlTab.addEventListener('click', () => {
    currentMode = 'url';
    urlTab.classList.add('bg-blue-600', 'text-white');
    urlTab.classList.remove('bg-gray-200', 'dark:bg-gray-700', 'text-gray-900', 'dark:text-white');
    uploadTab.classList.remove('bg-blue-600', 'text-white');
    uploadTab.classList.add('bg-gray-200', 'dark:bg-gray-700', 'text-gray-900', 'dark:text-white');
    urlSection.classList.remove('hidden');
    uploadSection.classList.add('hidden');
  });

  // File selection and validation
  fileInput.addEventListener('change', async (e) => {
    const file = (e.target as HTMLInputElement).files?.[0];
    if (!file) return;

    // Validate file size (max 1MB)
    const maxSize = 1024 * 1024; // 1MB in bytes
    if (file.size > maxSize) {
      alert(`File size (${(file.size / 1024 / 1024).toFixed(2)}MB) exceeds the maximum limit of 1MB. Please choose a smaller image.`);
      fileInput.value = '';
      return;
    }

    // Validate file type
    if (!file.type.startsWith('image/')) {
      alert('Please select a valid image file.');
      fileInput.value = '';
      return;
    }

    selectedFile = file;

    // Show preview
    const reader = new FileReader();
    reader.onload = (e) => {
      preview.src = e.target?.result as string;
      previewContainer.classList.remove('hidden');
      fileSizeInfo.textContent = `File size: ${(file.size / 1024).toFixed(2)} KB`;
    };
    reader.readAsDataURL(file);
  });

  // Insert image
  insertBtn.addEventListener('click', async () => {
    if (currentMode === 'upload') {
      if (!selectedFile) {
        alert('Please select an image file first.');
        return;
      }

      // Show progress
      const progressDiv = document.getElementById('upload-progress')!;
      const progressBar = document.getElementById('upload-progress-bar')!;
      const statusText = document.getElementById('upload-status')!;
      progressDiv.classList.remove('hidden');
      insertBtn.disabled = true;

      try {
        const formData = new FormData();
        formData.append('file', selectedFile);

        const token = localStorage.getItem('token') || localStorage.getItem('auth_token');
        const apiUrl = getApiBaseUrl();

        progressBar.style.width = '50%';
        statusText.textContent = 'Uploading...';

        const response = await fetch(`${apiUrl}/api/blogs/upload-image`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
          },
          body: formData,
        });

        if (!response.ok) {
          const error = await response.json();
          throw new Error(error.detail || 'Failed to upload image');
        }

        const result = await response.json();
        uploadedImageUrl = result.image_url;

        progressBar.style.width = '100%';
        statusText.textContent = 'Upload complete!';

        // Get dimension controls
        const maxWidth = parseInt((document.getElementById('image-max-width') as HTMLInputElement).value);
        const maxHeight = parseInt((document.getElementById('image-max-height') as HTMLInputElement).value);
        const altText = (document.getElementById('upload-image-alt') as HTMLInputElement).value || selectedFile.name.split('.')[0];

        // Insert image with size constraints
        const imgHtml = `<img src="${uploadedImageUrl}" alt="${altText}" style="max-width: ${maxWidth}px; max-height: ${maxHeight}px; width: auto; height: auto;" loading="lazy" />`;
        editor.chain().focus().insertContent(imgHtml).run();

        // Close modal
        modal.classList.add('hidden');
        resetModal();
      } catch (error) {
        console.error('Error uploading image:', error);
        alert(`Failed to upload image: ${error instanceof Error ? error.message : 'Unknown error'}`);
      } finally {
        progressDiv.classList.add('hidden');
        insertBtn.disabled = false;
        progressBar.style.width = '0%';
      }
    } else {
      // URL mode
      const url = (document.getElementById('image-url-input') as HTMLInputElement).value;
      if (!url || url === 'https://') {
        alert('Please enter a valid image URL.');
        return;
      }

      const maxWidth = parseInt((document.getElementById('url-image-width') as HTMLInputElement).value);
      const maxHeight = parseInt((document.getElementById('url-image-height') as HTMLInputElement).value);
      const altText = (document.getElementById('url-image-alt') as HTMLInputElement).value || 'Image';

      // Insert image with size constraints
      const imgHtml = `<img src="${url}" alt="${altText}" style="max-width: ${maxWidth}px; max-height: ${maxHeight}px; width: auto; height: auto;" loading="lazy" />`;
      editor.chain().focus().insertContent(imgHtml).run();

      // Close modal
      modal.classList.add('hidden');
      resetModal();
    }
  });

  // Cancel button
  cancelBtn.addEventListener('click', () => {
    modal.classList.add('hidden');
    resetModal();
  });

  function resetModal() {
    fileInput.value = '';
    (document.getElementById('image-url-input') as HTMLInputElement).value = '';
    (document.getElementById('upload-image-alt') as HTMLInputElement).value = '';
    (document.getElementById('url-image-alt') as HTMLInputElement).value = '';
    previewContainer.classList.add('hidden');
    selectedFile = null;
    uploadedImageUrl = '';
  }
}

async function handleInsertVideo(editor: Editor) {
  const url = window.prompt('Enter YouTube or Vimeo video URL:', 'https://');
  
  if (!url || url === 'https://') {
    return;
  }

  try {
    // Validate video URL with backend
    const token = localStorage.getItem('token') || localStorage.getItem('auth_token');
    const apiUrl = getApiBaseUrl();
    
    const response = await fetch(`${apiUrl}/api/blogs/validate-video?video_url=${encodeURIComponent(url)}`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });

    const result = await response.json();

    if (result.valid) {
      if (result.platform === 'youtube') {
        // Use TipTap YouTube extension
        editor.chain().focus().setYoutubeVideo({
          src: url,
          width: 640,
          height: 360,
        }).run();
      } else if (result.platform === 'vimeo') {
        // Insert Vimeo iframe
        const iframe = `<iframe src="${result.embed_url}" width="640" height="360" frameborder="0" allow="autoplay; fullscreen; picture-in-picture" allowfullscreen loading="lazy"></iframe>`;
        editor.chain().focus().insertContent(iframe).run();
      }
      alert('Video embedded successfully!');
    } else {
      alert(result.error || 'Invalid video URL. Only YouTube and Vimeo are supported.');
    }
  } catch (error) {
    console.error('Error validating video:', error);
    alert('Failed to validate video URL. Please try again.');
  }
}

async function handleTextColor(editor: Editor) {
  const color = window.prompt('Enter text color (hex code or name):', '#000000');
  if (color) {
    editor.chain().focus().setColor(color).run();
  }
}

async function handleHighlightColor(editor: Editor) {
  const color = window.prompt('Enter highlight color (hex code or name):', '#ffff00');
  if (color) {
    editor.chain().focus().setHighlight({ color }).run();
  }
}

function getApiBaseUrl() {
  // Priority 1: Check environment variable
  if (typeof import.meta !== 'undefined' && import.meta.env?.PUBLIC_API_URL) {
    return import.meta.env.PUBLIC_API_URL;
  }
  
  // Priority 2: For Codespaces/Preview environments
  if (typeof window !== 'undefined') {
    const currentOrigin = window.location.origin;
    if (currentOrigin.includes('preview.app.github.dev') || 
        currentOrigin.includes('github.dev') ||
        currentOrigin.includes('preview.emergentagent.com')) {
      return currentOrigin.replace(':3000', ':8001').replace('3000-', '8001-');
    }
  }
  
  // Priority 3: Default to localhost
  return 'http://localhost:8001';
}

export function getEditorContent(): string {
  return editor?.getHTML() || '';
}

export function setEditorContent(html: string) {
  editor?.commands.setContent(html);
}

export function destroyEditor() {
  if (editor) {
    editor.destroy();
    editor = null;
  }
}

// Export for global access
if (typeof window !== 'undefined') {
  (window as any).initRichTextEditor = initRichTextEditor;
  (window as any).getEditorContent = getEditorContent;
  (window as any).setEditorContent = setEditorContent;
  (window as any).destroyEditor = destroyEditor;
}
