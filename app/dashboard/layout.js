"use client";
import React, { useState } from "react";
import { Drawer } from "antd";
import Link from "next/link";
import { MenuOutlined } from "@ant-design/icons";
import { QueryClientProvider, QueryClient } from "react-query";

const queryClient = new QueryClient();

function Layout({ children }) {
  const [open, setOpen] = useState(false);
  const showDrawer = () => {
    setOpen(true);
  };
  const onClose = () => {
    setOpen(false);
  };

  const Paths = [
    {
      name: "Dashboard",
      path: "/dashboard",
    },
    {
      name: "Tasks",
      path: "/tasks",
    },
    {
      name: "Members",
      path: "/members",
    },
    {
      name: "About Dev",
      path: "/about-dev",
    },
  ];

  return (
    <QueryClientProvider client={queryClient} contextSharing={true}>
      <div>
        <div
          onClick={() => showDrawer()}
          className="absolute cursor-pointer top-[40px] left-[40px]"
        >
          <MenuOutlined
            color="black"
            style={{
              fontSize: "30px",
            }}
          />
        </div>
        <Drawer
          title="PMD"
          placement={"left"}
          closable={true}
          onClose={onClose}
          open={open}
          key={"left"}
        >
          <div className="space-y-[30px] flex flex-col">
            {" "}
            <Link
              href={"/dashboard"}
              onClick={() => setOpen(false)}
              className="w-full text-[24px] hover:bg-gray-300 text-black px-[20px] py-[30px] bg-gray-100"
            >
              Dashboard
            </Link>
            <Link
              onClick={() => setOpen(false)}
              href={"/dashboard"}
              className="w-full text-[24px] hover:bg-gray-300 text-black px-[20px] py-[30px] bg-gray-100"
            >
              Tasks
            </Link>
            <Link
              onClick={() => setOpen(false)}
              href={"/members"}
              className="w-full text-[24px] hover:bg-gray-300 text-black px-[20px] py-[30px] bg-gray-100"
            >
              Members
            </Link>
          </div>
        </Drawer>
        <div className="px-[10%] py-[10%]">{children}</div>
      </div>
    </QueryClientProvider>
  );
}

export default Layout;
