import { atom } from "jotai";

export const searchQuery = atom<string>("");
export const isSearchOpenAtom = atom<boolean>(false);
