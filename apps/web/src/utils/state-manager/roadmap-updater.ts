import { Roadmap } from "@/lib/types/Roadmap";
import { StateSpace, StateStorage } from "@/lib/types/States";

/**
 * Updates the state of a roadmap within a given state storage.
 *
 * @param {Roadmap} roadmap - The roadmap object to be manipulated.
 * @param {number} spaceIndex - The index of the space within the state storage where the roadmap resides.
 * @param {StateStorage} stateStorage - The current state storage object.
 * @param {function} setStateSpaces - Function to update the state spaces.
 * @param {"create" | "update" | "delete"} strategy - The strategy to apply: "create" to add a new roadmap, "update" to modify an existing roadmap, or "delete" to remove a roadmap.
 */
export const updateRoadmapState = (
  roadmap: Roadmap,
  spaceIndex: number,
  stateStorage: StateStorage,
  setStateSpaces: (spaces: StateSpace[]) => void,
  strategy: "create" | "update" | "delete"
) => {
  let storage: StateStorage = JSON.parse(JSON.stringify(stateStorage)); // copy the object
  let spaces = storage.spaces.slice(); // copy the array

  if (strategy === "create") {
    // Add the item to the array
    spaces[spaceIndex].roadmaps.push(roadmap);
    setStateSpaces(spaces);
    return;
  } else if (strategy === "update") {
    const index = spaces[spaceIndex].roadmaps.findIndex(
      (a) => a._id === roadmap._id
    );
    // Replace the item in the array
    spaces[spaceIndex].roadmaps[index] = roadmap;
    setStateSpaces(spaces);
    return;
  } else if (strategy === "delete") {
    const index = spaces[spaceIndex].roadmaps.findIndex(
      (a) => a._id === roadmap._id
    );
    spaces[spaceIndex].roadmaps.splice(index, 1);
    setStateSpaces(spaces);
    return;
  }
};
