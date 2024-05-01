"use client";
import { useCounterStore } from "@/management/providers/counter-store-provider";
import React, { useEffect, useState } from "react";
import { useMutation, useQuery } from "react-query";
import { Button, Drawer, Modal, Tooltip, message } from "antd";
import { Draggable } from "@/components/Draggable";

let MEMBERS = [];
let UPDATED_MEMBERS = [];

function Page() {
  const [open, setOpen] = useState(false);
  const [selectedProject, setSelectedProject] = useState({});
  const [selectedTask, setSelectedTask] = useState({});
  const [loading, setLoading] = useState(false);
  const [member, setMember] = useState("");
  const [draggingTask, setDraggingTask] = useState({});
  const [styles, setStyles] = useState({});

  const [newTask, setNewTask] = useState({
    task_id: Date.now(),
    name: "",
    description: "",
    deadline: "",
    assigned_members: [],
    completed: false,
  });

  const [searchValue, setSearchValue] = useState("");

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isModalTwoOpen, setIsModalTwoOpen] = useState(false);
  const [isModalThreeOpen, setIsModalThreeOpen] = useState(false);
  const showModal = () => {
    setIsModalOpen(true);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };

  const onClose = () => {
    setOpen(false);
  };
  const { count, incrementCount, decrementCount } = useCounterStore(
    (state) => state
  );

  const all_projects = useQuery({
    queryKey: ["projects"],
    queryFn: async () => {
      return await fetch("https://pmdrest.vercel.app/api/projects").then(
        (response) => response.json()
      );
    },
  });

  async function postNewTask(selectedProjectId, taskData) {
    const apiUrl = `https://pmdrest.vercel.app/api/projects/newtask/${selectedProjectId}`;
    console.log(taskData);

    try {
      setLoading(true);
      const response = await fetch(apiUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(taskData),
      });

      if (!response.ok) {
        throw new Error("Failed to post new task");
      }

      const responseData = await response.json();
      setLoading(false);
      handleCancel();
      await all_projects.refetch();
      setOpen(false);
      message.success("Task Created Successfully");
      return responseData;
    } catch (error) {
      console.error("Error posting new task:", error.message);
      setLoading(false);
      handleCancel();
      return null;
    }
  }

  async function updateTask(selectedTask, taskData) {
    const apiUrl = `https://pmdrest.vercel.app/api/projects/task/${taskData.task_id}`;
    console.log(taskData);

    try {
      setLoading(true);
      const response = await fetch(apiUrl, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(taskData),
      });

      if (!response.ok) {
        throw new Error("Failed to post new task");
      }

      const responseData = await response.json();
      setLoading(false);
      setIsModalThreeOpen(false);
      await all_projects.refetch();
      setOpen(false);
      message.success("Task Updated Successfully");
      return responseData;
    } catch (error) {
      console.error("Error posting new task:", error.message);
      setLoading(false);
      setIsModalThreeOpen(false);
      return null;
    }
  }

  async function markTask(selectedTask, taskData) {
    const apiUrl = `https://pmdrest.vercel.app/api/projects/mark/${taskData.task_id}`;
    console.log(taskData);

    try {
      setLoading(true);
      const response = await fetch(apiUrl, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(taskData),
      });

      if (!response.ok) {
        throw new Error("Failed to post new task");
      }

      const responseData = await response.json();
      setLoading(false);
      setIsModalThreeOpen(false);
      await all_projects.refetch();
      setOpen(false);
      return responseData;
    } catch (error) {
      console.error("Error posting new task:", error.message);
      setLoading(false);
      setIsModalThreeOpen(false);
      return null;
    }
  }

  async function addNewMember(selectedProjectId, member) {
    const apiUrl = `https://pmdrest.vercel.app/api/projects/member/${selectedProjectId}`;
    console.log(member);

    try {
      setLoading(true);
      const response = await fetch(apiUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: member,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to post new member");
      }

      const responseData = await response.json();
      setLoading(false);
      setIsModalTwoOpen(false);
      setMember("");
      await all_projects.refetch();
      setOpen(false);
      message.success("New Member Added Successfully");
      return responseData;
    } catch (error) {
      console.error("Error posting new task:", error.message);
      setLoading(false);
      setIsModalTwoOpen(false);
      return null;
    }
  }

  const [isDropped, setIsDropped] = useState(false);

  return (
    <div className="w-auto flex flex-col justify-center items-center space-y-[40px] mobile:mt-[60px] laptop:mt-0">
      <Modal
        title="Update Task"
        open={isModalThreeOpen}
        onCancel={() => setIsModalThreeOpen(false)}
        footer={[
          <Button
            key="submit"
            type="primary"
            loading={loading}
            onClick={() => updateTask(selectedTask.task_id, selectedTask)}
          >
            {loading ? "Wait..." : "Submit"}
          </Button>,
        ]}
        style={{
          zIndex: 99999999999,
        }}
      >
        <div className="space-y-[20px] flex flex-col">
          <input
            value={selectedTask.name}
            onChange={(e) =>
              setSelectedTask({ ...selectedTask, name: e.target.value })
            }
            placeholder="Title"
            className="w-full border-2 border-black/70 h-[80px] p-4 text-[22px] font-semibold rounded-2xl outline-none"
          />
          <input
            value={selectedTask.description}
            onChange={(e) =>
              setSelectedTask({
                ...selectedTask,
                description: e.target.value,
              })
            }
            placeholder="Description"
            className="w-full border-2 border-black/70 h-[80px] p-4 text-[22px] font-semibold rounded-2xl outline-none"
          />
          <div>
            <p className="text-[22px] font-semibold">Assign Members</p>
            <div className="p-[15px] flex flex-wrap my-[20px] gap-[20px] bg-slate-900 rounded-2xl w-full h-auto text-white">
              {selectedTask?.assigned_members?.map((data, index) => (
                <span
                  key={index}
                  className="font-bold text-[26px] bg-gray-200 text-black p-1"
                >
                  {data.name}
                </span>
              ))}
            </div>
            <input
              value={member}
              onChange={(e) => setMember(e.target.value)}
              onKeyDown={(e) => {
                if (e.key == "Enter") {
                  e.preventDefault();
                  UPDATED_MEMBERS.unshift({
                    name: member,
                  });
                  setSelectedTask({
                    ...selectedTask,
                    assigned_members: [
                      ...selectedTask.assigned_members,
                      {
                        name: member,
                      },
                    ],
                  });
                  setMember("");
                }
              }}
              placeholder="Write a member name and press Enter to add"
              className="w-full border-2 border-black/70 h-[80px] p-4 text-[22px] font-semibold rounded-2xl outline-none"
            />
          </div>

          <div>
            <p className="text-[22px] font-semibold">Deadline</p>
            <input
              value={selectedTask.deadline}
              onChange={(e) =>
                setSelectedTask({ ...selectedTask, deadline: e.target.value })
              }
              type="date"
              placeholder="Deadline"
              className="w-full border-2 border-black/70 h-[80px] p-4 text-[22px] font-semibold rounded-2xl outline-none"
            />
          </div>
        </div>
      </Modal>
      <Modal
        title="New Task"
        open={isModalOpen}
        onCancel={handleCancel}
        footer={[
          <Button
            key="submit"
            type="primary"
            loading={loading}
            onClick={() => postNewTask(selectedProject._id, newTask)}
          >
            {loading ? "Wait..." : "Submit"}
          </Button>,
        ]}
      >
        <div className="space-y-[20px] flex flex-col">
          <input
            value={newTask.name}
            onChange={(e) => setNewTask({ ...newTask, name: e.target.value })}
            placeholder="Title"
            className="w-full border-2 border-black/70 h-[80px] p-4 text-[22px] font-semibold rounded-2xl outline-none"
          />
          <input
            value={newTask.description}
            onChange={(e) =>
              setNewTask({ ...newTask, description: e.target.value })
            }
            placeholder="Description"
            className="w-full border-2 border-black/70 h-[80px] p-4 text-[22px] font-semibold rounded-2xl outline-none"
          />
          <div>
            <p className="text-[22px] font-semibold">Assign Members</p>
            <div className="p-[15px] flex flex-wrap my-[20px] gap-[20px] bg-slate-900 rounded-2xl w-full h-auto text-white">
              {MEMBERS?.map((data, index) => (
                <span
                  key={index}
                  className="font-bold text-[26px] bg-gray-200 text-black p-1"
                >
                  {data.name}
                </span>
              ))}
            </div>
            <input
              value={member}
              onChange={(e) => setMember(e.target.value)}
              onKeyDown={(e) => {
                if (e.key == "Enter") {
                  e.preventDefault();
                  MEMBERS.unshift({
                    name: member,
                  });
                  setNewTask({ ...newTask, assigned_members: MEMBERS });
                  setMember("");
                }
              }}
              placeholder="Write a member name and press Enter to add"
              className="w-full border-2 border-black/70 h-[80px] p-4 text-[22px] font-semibold rounded-2xl outline-none"
            />
          </div>

          <div>
            <p className="text-[22px] font-semibold">Deadline</p>
            <input
              value={newTask.deadline}
              onChange={(e) =>
                setNewTask({ ...newTask, deadline: e.target.value })
              }
              type="date"
              placeholder="Deadline"
              className="w-full border-2 border-black/70 h-[80px] p-4 text-[22px] font-semibold rounded-2xl outline-none"
            />
          </div>
        </div>
      </Modal>
      <Modal
        title="Add Team Member"
        open={isModalTwoOpen}
        onCancel={handleCancel}
        footer={[
          <Button
            key="submit"
            type="primary"
            loading={loading}
            onClick={() => addNewMember(selectedProject._id, member)}
          >
            {loading ? "Wait..." : "Submit"}
          </Button>,
        ]}
      >
        <div className="space-y-[20px] flex flex-col">
          <input
            value={member}
            onChange={(e) => setMember(e.target.value)}
            placeholder="Member Name"
            className="w-full border-2 border-black/70 h-[80px] p-4 text-[22px] font-semibold rounded-2xl outline-none"
          />
        </div>
      </Modal>
      <Drawer
        placement={"right"}
        closable={true}
        title="Project Details"
        onClose={onClose}
        open={open}
        width={700}
      >
        <input
          value={searchValue}
          onChange={(e) => setSearchValue(e.target.value)}
          placeholder="Search a task..."
          className="w-full border-2 border-black/70 h-[80px] p-4 text-[22px] font-semibold rounded-2xl outline-none"
        />
        <div>
          <div className="flex justify-between place-items-center">
            <p className="font-bold text-[30px] py-[20px]">Tasks</p>
            <button
              onClick={() => showModal()}
              className="bg-slate-900 p-3 text-white rounded-3xl"
            >
              Add New Task
            </button>
          </div>
          <div className="mt-[30px] flex flex-col space-y-[20px]">
            {selectedProject?.tasks
              ?.filter((data) => {
                if (searchValue !== "") {
                  const filtered = data.name
                    .toLowerCase()
                    .includes(searchValue.toLowerCase());
                  return filtered;
                } else {
                  return data;
                }
              })
              .map((data, index) => (
                <Draggable
                  id={data.name}
                  onDragStart={() => {
                    setDraggingTask(data);
                    setStyles({
                      cursor: "move",
                    });
                    console.log(data);
                  }}
                  onDragEnd={() => {
                    markTask(draggingTask, draggingTask);
                    setStyles({
                      cursor: "auto",
                    });

                    message.success(
                      "Marked As Completed Successfully and Placed to the bottom of the list"
                    );
                  }}
                >
                  <div
                    style={styles}
                    key={index}
                    className="p-[15px] bg-slate-900 rounded-2xl w-full h-auto text-white/70"
                  >
                    <p className="font-bold text-[26px]">{data.name}</p>

                    <p className="font-normal text-[20px] mt-[13px]">
                      <span className="font-bold">Description:</span>{" "}
                      {data.description}
                    </p>
                    <p className="font-normal text-[20px] mt-[13px]">
                      Assigned Members:{" "}
                      {data.assigned_members.map((data, index) => (
                        <span
                          key={index}
                          className="font-normal bg-gray-200 text-black p-1 mr-[5px]"
                        >
                          {data.name}
                        </span>
                      ))}
                    </p>
                    <p className="font-normal text-[16px] mt-[13px]">
                      Deadline: {data.deadline}
                    </p>
                    <p className="font-normal text-[16px] mt-[2px]">
                      Status: {data.completed ? "Done" : "In Progress"}
                    </p>
                    <button
                      onClick={() => {
                        setSelectedTask(data);
                        setIsModalThreeOpen(true);
                      }}
                      className="bg-slate-700 mt-5 p-3 text-white rounded-3xl"
                    >
                      Edit Task
                    </button>
                  </div>
                </Draggable>
              ))}
          </div>
        </div>
        <div>
          <div className="flex justify-between place-items-center">
            <p className="font-bold text-[30px] py-[20px]">Team Members</p>
            <button
              onClick={() => setIsModalTwoOpen(true)}
              className="bg-slate-900 p-3 text-white rounded-3xl"
            >
              Add New Member
            </button>
          </div>
          <div className="p-[15px] flex flex-wrap gap-[20px] bg-slate-900 rounded-2xl w-full h-auto text-white">
            {selectedProject?.team_members?.map((data, index) => (
              <span
                key={index}
                className="font-bold text-[26px] bg-gray-200 text-black p-1"
              >
                {data.name}
              </span>
            ))}
          </div>
        </div>
        <div>
          <p className="font-bold text-[30px] mt-[30px] py-[20px]">
            Recent Activities
          </p>
          <div className="mt-[30px] flex flex-col space-y-[20px]">
            {selectedProject?.recent_activities?.map((data, index) => (
              <div
                key={index}
                className="p-[15px] bg-slate-900 rounded-2xl w-full h-auto text-white/70"
              >
                <p className="font-semibold text-[26px]">{data.title}</p>
              </div>
            ))}
          </div>
        </div>
      </Drawer>
      {all_projects.data?.data?.map((data, index) => (
        <div
          key={index}
          className="bg-slate-900 place-content-center place-items-center text-white/70 flex laptop:flex-row mobile:flex-col justify-between rounded-2xl p-[30px] mobile:w-full laptop:w-[800px] mobile:h-auto laptop:h-[200px]"
        >
          <div>
            <p className="font-bold text-[28px]">Project {index + 1}</p>
            <p className="font-normal mt-[15px] text-[20px]">
              Project ID: {data._id}
            </p>
          </div>
          <div className="flex laptop:mt-0 mobile:mt-[20px] flex-col place-items-center place-content-center space-y-2">
            <button
              onClick={() => {
                setSelectedProject(data);
                setOpen(true);
              }}
              className="h-[50px] hover:bg-slate-500 w-[80px] bg-slate-700 rounded-3xl flex place-items-center place-content-center text-white"
            >
              <p>View</p>
            </button>
            <Tooltip title="Functionality Not Added, Sorry !">
              <button className="h-[50px] hover:bg-slate-500 w-[80px] bg-slate-700 rounded-3xl flex place-items-center place-content-center text-white">
                <p>Edit</p>
              </button>
            </Tooltip>
            <Tooltip title="Functionality Not Added, Sorry !">
              <button className="h-[50px] hover:bg-slate-500 w-[80px] bg-red-600 rounded-3xl flex place-items-center place-content-center text-white">
                <p>Delete</p>
              </button>
            </Tooltip>
          </div>
        </div>
      ))}
      {open && (
        <div className="fixed w-[500px] z-[900] bg-slate-950/50 p-[10px] rounded-3xl text-[60px] text-white/70 top-[200px] left-[100px]">
          {isDropped ? draggableMarkup : "Drop here a task to mark as done"}
        </div>
      )}
    </div>
  );
}

export default Page;
