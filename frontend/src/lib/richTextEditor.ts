/**
 * Enhanced Rich Text Editor Initialization using TipTap
 * Features: Images, Videos, Code Blocks, Links, Tables, Text Formatting, Colors, Alignment
 */

import { Editor } from '@tiptap/core';
import StarterKit from '@tiptap/starter-kit';
import Image from '@tiptap/extension-image';
import Link from '@tiptap/extension-link';
import CodeBlockLowlight from '@tiptap/extension-code-block-lowlight';
import Underline from '@tiptap/extension-underline';
import TextAlign from '@tiptap/extension-text-align';
import TextStyle from '@tiptap/extension-text-style';
import { Color } from '@tiptap/extension-color';
import Highlight from '@tiptap/extension-highlight';
import Table from '@tiptap/extension-table';
import TableRow from '@tiptap/extension-table-row';
import TableHeader from '@tiptap/extension-table-header';
import TableCell from '@tiptap/extension-table-cell';
import HorizontalRule from '@tiptap/extension-horizontal-rule';
import Youtube from '@tiptap/extension-youtube';
import { lowlight } from 'lowlight';

// Import languages for syntax highlighting
import javascript from 'highlight.js/lib/languages/javascript';
import typescript from 'highlight.js/lib/languages/typescript';
import python from 'highlight.js/lib/languages/python';
import html from 'highlight.js/lib/languages/xml';
import css from 'highlight.js/lib/languages/css';
import json from 'highlight.js/lib/languages/json';
import bash from 'highlight.js/lib/languages/bash';

// Register languages
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

  return editor;
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
  // Ask user if they want to upload or provide URL
  const choice = window.confirm('Click OK to upload an image, or Cancel to enter an image URL');

  if (choice) {
    // Upload image
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*,.gif';
    input.onchange = async (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (!file) return;

      try {
        // Show loading state
        const loadingMsg = document.createElement('div');
        loadingMsg.textContent = 'Uploading image...';
        loadingMsg.className = 'fixed top-4 right-4 bg-blue-600 text-white px-4 py-2 rounded shadow-lg z-50';
        document.body.appendChild(loadingMsg);

        // Upload to backend
        const formData = new FormData();
        formData.append('file', file);

        const token = localStorage.getItem('token') || localStorage.getItem('auth_token');
        
        // Get API base URL
        const apiUrl = getApiBaseUrl();
        
        const response = await fetch(`${apiUrl}/api/blogs/upload-image`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
          },
          body: formData,
        });

        if (!response.ok) {
          throw new Error('Failed to upload image');
        }

        const result = await response.json();
        
        // Remove loading message
        document.body.removeChild(loadingMsg);

        // Ask for alt text
        const altText = window.prompt('Enter alt text for accessibility (optional):', file.name.split('.')[0]);

        // Insert image into editor
        editor.chain().focus().setImage({ 
          src: result.image_url,
          alt: altText || ''
        }).run();

        alert('Image uploaded successfully!');
      } catch (error) {
        console.error('Error uploading image:', error);
        alert('Failed to upload image. Please try again.');
      }
    };
    input.click();
  } else {
    // Enter URL
    const url = window.prompt('Enter image URL:', 'https://');
    if (url && url !== 'https://') {
      const altText = window.prompt('Enter alt text for accessibility (optional):', '');
      editor.chain().focus().setImage({ src: url, alt: altText || '' }).run();
    }
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
  if (typeof window !== 'undefined') {
    const currentOrigin = window.location.origin;
    if (currentOrigin.includes('preview.app.github.dev') || 
        currentOrigin.includes('github.dev') ||
        currentOrigin.includes('preview.emergentagent.com')) {
      return currentOrigin.replace(':3000', ':8001').replace('3000-', '8001-');
    }
  }
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
