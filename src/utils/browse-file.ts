export const browseFile = (): Promise<File> => new Promise(resolve => {
    const input = document.createElement('input');
    input.type = 'file';
    input.addEventListener('change', () => resolve(input.files[0]));
    input.click();
});

export const readFileAsText = (file: File): Promise<string> => new Promise(resolve => {
    const fr = new FileReader();
    fr.addEventListener('loadend', () => resolve(fr.result as string));
    fr.readAsText(file);
});
