import React from 'react'
import { DropzoneInputProps, DropzoneRootProps } from 'react-dropzone';

type Props = {
    getRootProps: <T extends DropzoneRootProps>(props?: T) => T;
    getInputProps: <T extends DropzoneInputProps>(props?: T) => T;
    isDragActive: boolean;
    placeholder?: string;
    className?: string;
};

function InputFile({ getRootProps, getInputProps, isDragActive, placeholder, className }: Props) {
  return (
    <div {...getRootProps()} className={`bg-zinc-100 dark:bg-zinc-900/25 hover:bg-zinc-200/50 hover:dark:bg-zinc-900/50 text-zinc-500 hover:text-zinc-700 hover:dark:text-zinc-300 rounded-lg border-2 border-dashed border-zinc-300 dark:border-zinc-800 focus:outline focus:outline-1 focus:outline-blue-500 py-20 px-8 text-center cursor-pointer transition-colors ${className}`}>
        <input {...getInputProps()} />
        {isDragActive ? (
            <p>Drop the file here...</p>
        ) : (
            <p>{placeholder}</p>
        )}
    </div>
  )
}

export default InputFile