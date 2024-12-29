import { toast } from "@/components/ui/use-toast";
import { Item, MyItems } from "@/lib/types/Items";
import { StateSpace, StateStorage } from "@/lib/types/States";
import { getMyItems } from "@/server/fetchers/items/get-workitems";
import { patchItem } from "@/server/patchers/item-patcher";

/**
 * Adds an item to an array if it does not already exist, and returns a new sorted array.
 *
 * @param {Item[]} array - The original array of items.
 * @param {Item} item - The item to be added to the array.
 * @returns {Item[]} A new array with the item added if it was not already present, sorted by sequenceId.
 */
const addItemToArray = (array: Item[], item: Item) => {
  let newArray = [...array];
  const index = array.findIndex((a) => a._id === item._id);
  if (index === -1) {
    newArray.push(item);
  }
  return newArray.sort((a, b) => a.sequenceId - b.sequenceId);
};

/**
 * Removes an item from an array if it exists, and returns a new sorted array.
 *
 * @param {Item[]} array - The original array of items.
 * @param {Item} item - The item to be removed from the array.
 * @returns {Item[]} A new array with the item removed if it was present, sorted by sequenceId.
 */
const removeItemFromArray = (array: Item[], item: Item) => {
  const index = array.findIndex((a) => a._id === item._id);
  if (index !== -1) {
    const newArray = array.filter((i) => i._id !== item._id);
    return newArray.sort((a, b) => a.sequenceId - b.sequenceId);
  }
  return array.sort((a, b) => a.sequenceId - b.sequenceId);
};

/**
 * Updates an item in the state storage and refreshes the state.
 *
 * @param {any} body - The body content to be sent in the patch request.
 * @param {number} spaceIndex - The index of the space in the state storage.
 * @param {StateStorage} stateStorage - The current state storage object.
 * @param {function} setStateStorage - Function to update the state storage.
 * @param {string} slug - The slug identifier for the item.
 * @param {string} uuid - The unique identifier for the item.
 * @param {string} token - The authentication token.
 * @returns {Promise<void>} - A promise that resolves when the item is updated.
 */
export const UpdateItem = async (
  body: any,
  spaceIndex: number,
  stateStorage: StateStorage,
  setStateStorage: (myItems: MyItems, spaces: StateSpace[]) => void,
  slug: string,
  uuid: string,
  token: string
) => {
  const space = stateStorage.spaces[spaceIndex];
  const newItem = await patchItem(body, slug, space.name, uuid, token);
  if (!newItem) {
    toast({
      variant: "destructive",
      title: "Could not update item !",
    });
    return;
  }
  const myItems = await getMyItems(token, slug);
  UpdateItemsState(
    newItem,
    spaceIndex,
    myItems,
    stateStorage,
    setStateStorage,
    "update"
  );
};

/**
 * Updates the global state based on the given item and strategy.
 *
 * @param {Item} item - The item to be processed.
 * @param {number} spaceIndex - The index of the space in the state storage.
 * @param {MyItems} myItems - The current state of my items.
 * @param {StateStorage} stateStorage - The current state storage.
 * @param {function} setStateStorage - Function to update the state storage.
 * @param {"archive" | "unarchive" | "update" | "create" | "delete"} strategy - The strategy to apply.
 */
export const UpdateItemsState = (
  item: Item,
  spaceIndex: number,
  myItems: MyItems,
  stateStorage: StateStorage,
  setStateStorage: (myItems: MyItems, spaces: StateSpace[]) => void,
  strategy: "archive" | "unarchive" | "update" | "create" | "delete"
) => {
  let storage: StateStorage = JSON.parse(JSON.stringify(stateStorage)); // copy the object
  let spaces = storage.spaces.slice(); // copy the array
  let items = spaces[spaceIndex].items.slice(); // copy the array

  if (strategy === "archive") {
    let archived = storage.spaces[spaceIndex].archived;
    let localMyItems: MyItems = JSON.parse(JSON.stringify(myItems)); // copy the object
    // Add and remove item from arrays
    archived = addItemToArray(archived, item);
    items = removeItemFromArray(items, item);

    spaces[spaceIndex].archived = archived;
    spaces[spaceIndex].items = items;

    // locally update the myItems
    localMyItems.inbox = removeItemFromArray(localMyItems.inbox, item);
    localMyItems.today.current = removeItemFromArray(
      localMyItems.today.current,
      item
    );
    localMyItems.today.overdue = removeItemFromArray(
      localMyItems.today.overdue,
      item
    );

    setStateStorage(localMyItems, spaces);
    return;
  } else if (strategy === "unarchive") {
    let archived = storage.spaces[spaceIndex].archived;
    // Add and remove item from arrays
    archived = removeItemFromArray(archived, item);
    items = addItemToArray(items, item);

    spaces[spaceIndex].archived = archived;
    spaces[spaceIndex].items = items;

    setStateStorage(myItems, spaces);

    return;
  } else if (strategy === "update") {
    const itemIndex = items.findIndex((a) => a._id === item._id);
    // Replace the item in the array
    items[itemIndex] = item;
    spaces[spaceIndex].items = items;

    setStateStorage(myItems, spaces);

    return;
  } else if (strategy === "create") {
    // Add the item to the array
    items.push(item);
    spaces[spaceIndex].items = items;

    setStateStorage(myItems, spaces);

    return;
  } else {
    const index = items.findIndex((a) => a._id === item._id);
    items.splice(index, 1);
    storage.spaces[spaceIndex].items = items;
    setStateStorage(myItems, storage.spaces);

    return;
  }
};
