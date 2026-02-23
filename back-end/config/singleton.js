import { mockDeep, mockReset } from "jest-mock-extended";

export const prismaMock = mockDeep();

export const resetMock = () => {
  mockReset(prismaMock);
};