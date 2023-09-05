/*
 * ===================
 * authors information
 * ===================
 * 
 * 1. metadata about specific fields to tell UI what to display, how, and how to edit
 * 2. a constructor is present to easily create new entries when required
 * 3. an array of static data of entries to be displayed and manipulated in UI
 */

export const authorsMeta = {
  id: { name: "ID", editable: false, visible: true },
  name: { name: "Name", editable: true, visible: true, required: true },
  age: { name: "Age", editable: true, visible: true },
};
    
export function Author() {
  return {
      id: 0, 
      name: "", 
      age: 18
  }
};

export const authors = [
  {
    id: 1, 
    name: "Ian McEwan", 
    age: 42
  },
  {
    id: 2, 
    name: "Charles Dickens", 
    age: 105
  },
  {
    id: 3, 
    name: "Arthur Conan Doyle", 
    age: 125
  },
  {
    id: 4, 
    name: "Agatha Christie", 
    age: 98
  }
];