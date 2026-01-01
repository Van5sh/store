import React from "react";
import { colors } from "@/lib/colors";

export default function ProfilePage() {
  return (
    <div className="p-6 rounded-lg shadow-md" style={{ backgroundColor: colors.background.card }}>
      <strong className="text-2xl" style={{ color: colors.text.accent }}>User Profile Page</strong>
      <div style={{ marginTop: 12 }}>
        <h2 className="text-xl font-semibold mb-2" style={{ color: colors.text.primary }}>User Name</h2>
        <p className="mb-1" style={{ color: colors.text.secondary }}>DOB: 1990-01-01</p>
        <p style={{ color: colors.text.secondary }}>Address: —</p>
      </div>
    </div>
  );
}
