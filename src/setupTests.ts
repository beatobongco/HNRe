// @ts-nocheck
// jest-dom adds custom jest matchers for asserting on DOM nodes.
// allows you to do things like:
// expect(element).toHaveTextContent(/react/i)
// learn more: https://github.com/testing-library/jest-dom
import "@testing-library/jest-dom";

const observe = jest.fn();
const unobserve = jest.fn();
const io = jest.fn(() => ({
  observe,
  unobserve,
}));

window.IntersectionObserver = io;
global.IntersectionObserver = io;
