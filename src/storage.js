export const STORAGE_KEY = 'elem_program_matrix_v6';

export const readSavedState = () => {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? JSON.parse(saved) : null;
};

export const writeSavedState = (state) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
};
