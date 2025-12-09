import React from "react";

type Props = {
  children: React.ReactNode;
  editUser: React.ReactNode;
  orderdetails: React.ReactNode;
};

export default function UserLayout({ 
  children, 
  editUser, 
  orderdetails 
}: Props) {
  return (
    <div>
      <header>
        <h1>User Account</h1>
      </header>

      <main>{children}</main>
      
      <aside>
        <section>
          <h2>Edit User Slot</h2>
          {editUser}
        </section>

        <section>
          <h2>Order Details Slot</h2>
          {orderdetails}
        </section>
      </aside>
    </div>
  );
}