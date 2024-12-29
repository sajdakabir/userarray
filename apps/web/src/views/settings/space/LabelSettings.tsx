"use client";

import { CreateLabels, Label } from "@/lib/types/Labels";
import { NextButton } from "@/components/ui/custom-buttons";
import { useToast } from "@/components/ui/use-toast";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { PopoverClose } from "@radix-ui/react-popover";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useEffect, useMemo, useState } from "react";
import { USER_WORKSPACE } from "@/utils/constants/api-endpoints";
import axios, { AxiosError } from "axios";
import { dataStore, userStore } from "@/utils/store/zustand";
import { colors } from "@/lib/types/LabelColours";
import { Pencil, Trash2 } from "lucide-react";

const LabelSettingComponent = (props: {
  id: string;
  accessToken: string;
  slug: string;
}) => {
  // Global states
  const stateStorage = dataStore((state) => state.stateStorage);
  const setStateStorage = dataStore((state) => state.setStateStorage);
  const dayBoards = dataStore((state) => state.dayBoards);
  const setSlug = userStore((state) => state.setSlug);
  const setActive = userStore((state) => state.setCurrent);

  // Getting the index of the current space from the array of spaces
  const spaces = stateStorage!.spaces;
  const index = useMemo(() => {
    return spaces.findIndex((space) => space._id === props.id);
  }, [props.id, spaces]);

  const allabels = spaces[index].labels;
  // Local states
  const [name, setName] = useState<string>("");
  const [color, setColor] = useState<string>("#84cc16");
  const [loading, setLoading] = useState<boolean>(false);
  const [isOpen, setIsOpen] = useState<boolean>(false);

  const [editedLabels, setEditedLabels] = useState<Label[]>(allabels);

  const handleNameChange = (index: number, newName: string) => {
    setEditedLabels((prevLabels) =>
      prevLabels.map((label, i) =>
        i === index ? { ...label, name: newName } : label
      )
    );
  };

  const handleColorChange = (index: number, newColor: string) => {
    setEditedLabels((prevLabels) =>
      prevLabels.map((label, i) =>
        i === index ? { ...label, color: newColor } : label
      )
    );
  };

  const { toast } = useToast();

  useEffect(() => {
    setActive(`${spaces[index].name}-leb`);
    setSlug(props.slug);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const updateState = (label: Label, type: "add" | "delete" | "update") => {
    let temp = spaces;
    if (type === "add") {
      temp[index].labels.push(label);
    } else if (type === "delete") {
      temp[index].labels = temp[index].labels.filter(
        (labe) => label._id !== labe._id
      );
    } else {
      temp[index].labels = temp[index].labels.map((labe) => {
        if (labe._id === label._id) {
          return label;
        }
        return labe;
      });
    }
    setStateStorage(
      {
        inbox: stateStorage!.inbox,
        today: dayBoards[0].today,
      },
      temp
    );
  };

  const handleUpdate = async (
    labelId: string,
    newName: string,
    newColor: string
  ) => {
    try {
      const { data } = await axios.patch(
        USER_WORKSPACE +
          `/${props.slug}/spaces/${spaces[index].name}/labels/${labelId}`,
        {
          name: newName,
          color: newColor,
        },
        {
          headers: {
            Authorization: "Bearer " + props.accessToken,
          },
        }
      );
      toast({
        title: "Label Updated successfully!",
      });
      // Update existing labels
      const response: CreateLabels = data;
      updateState(response.response, "update");
    } catch (error) {
      const e = error as AxiosError;
      console.error(e.message);
      toast({
        variant: "destructive",
        title: "Sorry, couldn't update label",
      });
    }
  };

  const handleDelete = async (labelId: string) => {
    try {
      const { data } = await axios.delete(
        USER_WORKSPACE +
          `/${props.slug}/spaces/${spaces[index].name}/labels/${labelId}`,
        {
          headers: {
            Authorization: "Bearer " + props.accessToken,
          },
        }
      );
      toast({
        title: "Label Deleted successfully!",
      });
      // Remove from existing labels
      const response: CreateLabels = data;
      updateState(response.response, "delete");
    } catch (error) {
      const e = error as AxiosError;
      console.error(e.message);
      toast({
        variant: "destructive",
        title: "Sorry, couldn't delete label",
      });
    }
  };

  const handleCreate = async () => {
    if (!name) {
      return;
    }
    setLoading(true);
    try {
      const { data } = await axios.post(
        USER_WORKSPACE + `/${props.slug}/spaces/${spaces[index].name}/labels`,
        {
          name: name,
          color: color,
        },
        {
          headers: {
            Authorization: "Bearer " + props.accessToken,
          },
        }
      );
      toast({
        title: "Label Added successfully!",
      });
      // Add to existing labels
      const response: CreateLabels = data;
      setIsOpen(false);
      updateState(response.response, "add");
    } catch (error) {
      const e = error as AxiosError;
      console.error(e.message);
      toast({
        variant: "destructive",
        title: "Something Went Wrong!",
      });
    }

    setLoading(false);
  };

  return (
    <section className="flex-grow min-h-screen right-0 bg-dashboard md:px-24 md:py-16 overflow-y-auto">
      <div className="w-4/5">
        <form className="w-96 mx-auto md:mx-0">
          <h2 className="text-xl font-medium text-focus-text-hover">
            Labels for <span className="">{spaces[index].name}</span>
          </h2>

          <h4 className="text-focus-text text-sm mt-4">
            Labels allow you to categorize work items in a freeform fashion
          </h4>

          <DropdownMenu>
            <Dialog open={isOpen} onOpenChange={setIsOpen}>
              <DialogTrigger asChild>
                <div className="flex-grow my-12">
                  <NextButton
                    text="New Label"
                    type="button"
                    className="w-fit px-3 py-[6px] font-normal text-sm"
                  />
                </div>
              </DialogTrigger>
              <DialogContent className="bg-dashboard pt-8 text-focus-text-hover border-nonfocus-text border-none w-96">
                <DialogHeader>
                  <DialogTitle>Create New Label</DialogTitle>
                </DialogHeader>
                <form className="mt-6 mb-2 flex flex-col gap-1">
                  <div className="flex items-center justify-between gap-4">
                    <div className="flex flex-col w-full">
                      <label
                        className="text-focus-text mb-2 text-hx"
                        htmlFor="labelname"
                      >
                        Label Name
                      </label>
                      <input
                        value={name}
                        onChange={(e) => {
                          setName(e.target.value);
                        }}
                        className="text-sm"
                      />
                    </div>
                    <div className="flex flex-col">
                      <label className="text-focus-text mb-2 text-hx">
                        Colour
                      </label>
                      <div className="w-10 h-10 rounded-lg border border-classic-button grid place-items-center">
                        <DropdownMenuTrigger asChild>
                          <button
                            style={{
                              backgroundColor: color,
                            }}
                            className="h-6 w-6 rounded-full"
                          />
                        </DropdownMenuTrigger>
                      </div>
                      <DropdownMenuContent className="-mt-9 ml-[280px] p-2 bg-sidebar border-none text-focus-text-hover">
                        <div className="flex flex-wrap gap-3">
                          {colors.map((col, index) => {
                            const buttonStyle = {
                              backgroundColor: col.hex,
                            };
                            return (
                              <button
                                onClick={() => {
                                  setColor(col.hex);
                                }}
                                key={index}
                                style={buttonStyle}
                                className="h-6 w-6 rounded-full"
                              ></button>
                            );
                          })}
                        </div>
                      </DropdownMenuContent>
                    </div>
                  </div>
                </form>
                <DialogFooter className="flex items-center justify-end gap-2 mt-4">
                  <DialogClose className="bg-transparent text-sm border border-nonfocus-text hover:border-focus-text hover:bg-gray-600/30 text-white p-2 rounded-lg flex justify-center items-center">
                    Cancel
                  </DialogClose>
                  <NextButton
                    text="Add Label"
                    type="submit"
                    loading={loading}
                    handleClick={handleCreate}
                    disabled={!name}
                    className={`text-black text-sm w-fit px-3 py-2 ${
                      name ? "" : "bg-focus-text"
                    }`}
                  />
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </DropdownMenu>
        </form>

        {allabels.length !== 0 ? (
          <div className="flex flex-col gap-y-4 w-[32rem] select-none">
            {editedLabels.map((label, index_) => {
              const opacity = `${label.color}21`;
              const labelStyle = {
                backgroundColor: opacity,
                color: label.color,
                // borderColor: `${label.color}`,
              };
              return (
                <div
                  className="flex items-center item hover:scale-100 justify-between pl-2 pr-4 py-2"
                  key={label._id}
                >
                  <div
                    style={labelStyle}
                    className="px-3 py-1 font-semibold text-xs rounded-md"
                  >
                    {label.name}
                  </div>

                  <div className="flex gap-x-4 text-nonfocus-text items-center">
                    <DropdownMenu>
                      <Popover>
                        <PopoverTrigger
                          asChild
                          className="outline-none focus:outline-none"
                        >
                          <button className="hover:text-focus-text-hover">
                            <Pencil size={14} />
                          </button>
                        </PopoverTrigger>
                        <PopoverContent className="bg-sidebar rounded-[10px] text-focus-text-hover border-none">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-x-2">
                              <input
                                type="text"
                                value={label.name}
                                onChange={(e) =>
                                  handleNameChange(index_, e.target.value)
                                }
                                className="text-sm max-w-36 py-1"
                              />
                              <div className="w-[30px] h-[30px] rounded-lg border border-sidebar-button-hover grid place-items-center">
                                <DropdownMenuTrigger asChild>
                                  <button
                                    style={{
                                      backgroundColor: label.color,
                                    }}
                                    className="h-5 w-5 rounded-full"
                                  />
                                </DropdownMenuTrigger>
                              </div>
                            </div>
                            <DropdownMenuContent className="mt-5 mr-3 p-2 bg-sidebar border-none text-focus-text-hover">
                              <div className="flex flex-wrap gap-3">
                                {colors.map((col, index) => {
                                  const buttonStyle = {
                                    backgroundColor: col.hex,
                                  };
                                  return (
                                    <button
                                      onClick={() => {
                                        handleColorChange(index_, col.hex);
                                      }}
                                      key={index}
                                      style={buttonStyle}
                                      className="h-6 w-6 rounded-full"
                                    ></button>
                                  );
                                })}
                              </div>
                            </DropdownMenuContent>
                            <PopoverClose
                              onClick={() =>
                                handleUpdate(
                                  label.uuid,
                                  label.name,
                                  label.color
                                )
                              }
                              className="text-xs outline-none focus:outline-none px-2 py-[6px] bg-focus-text-hover text-black rounded-md"
                            >
                              Save
                            </PopoverClose>
                          </div>
                        </PopoverContent>
                      </Popover>
                    </DropdownMenu>
                    <Popover>
                      <PopoverTrigger
                        asChild
                        className="outline-none focus:outline-none"
                      >
                        <button className="hover:text-focus-text-hover">
                          <Trash2 size={14} />
                        </button>
                      </PopoverTrigger>
                      <PopoverContent className="bg-sidebar w-fit px-5 rounded-[10px] text-focus-text border-none">
                        <p className="text-sm">
                          Permanantly delete {label.name} label?
                        </p>

                        <div className="mt-6 flex items-center justify-end gap-2">
                          <PopoverClose className="text-xs outline-none focus:outline-none px-2 py-[6px] bg-focus-text-hover text-black rounded-md">
                            Cancel
                          </PopoverClose>
                          <button
                            onClick={() => handleDelete(label.uuid)}
                            className="text-xs px-2 py-[6px] bg-red-500 text-white rounded-md"
                          >
                            Delete
                          </button>
                        </div>
                      </PopoverContent>
                    </Popover>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="text-focus-text-hover text-sm mt-4">
            No labels yet. Create one !
          </div>
        )}
      </div>
    </section>
  );
};

export default LabelSettingComponent;
