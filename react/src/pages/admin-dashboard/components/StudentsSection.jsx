import React, { useState, useEffect } from "react";
import { supabase } from "../../../supabase";
import { toast } from "react-toastify";
import SearchBar from "./SearchBar";
import DataTable from "./DataTable";

const StudentsSection = () => {
  const [students, setStudents] = useState([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    fetchStudents();
  }, [search]);

  const fetchStudents = async () => {
    const query = supabase.from("students").select("*");
    if (search) {
      query.or(
        `first_name.ilike.%${search}%,last_name.ilike.%${search}%,student_id.ilike.%${search}%`
      );
    }
    const { data, error } = await query;
    if (!error) setStudents(data);
  };

  const observer = supabase
    .channel("students-changes")
    .on(
      "postgres_changes",
      {
        event: "*",
        schema: "public",
        table: "students",
      },
      (payload) => {
        if (payload.eventType === "UPDATE" && "is_approved" in payload.new) {
          // Update approval state in the local students array
          setStudents((prev) =>
            prev.map((student) =>
              student.student_id === payload.new.student_id
                ? { ...student, is_approved: payload.new.is_approved }
                : student
            )
          );
        } else {
          // For other changes (e.g., new rows or deletions), fetch all students
          fetchStudents();
        }
      }
    )
    .subscribe();

  const toggleApproval = async (studentId, isApproved) => {
    const { error } = await supabase
      .from("students")
      .update({ is_approved: !isApproved })
      .eq("student_id", studentId);

    if (error) {
      toast.error("Failed to update approval status.");
    } else {
      toast.success(isApproved ? "Student disapproved." : "Student approved.");
    }
  };

  const deleteStudent = async (studentId) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this student?"
    );
    if (!confirmDelete) return;

    const { error } = await supabase
      .from("students")
      .delete()
      .eq("student_id", studentId);
    if (error) {
      console.log(error);
      toast.error("Failed to delete student.");
    } else {
      toast.success("Student deleted.");
    }
  };

  return (
    <section id="students">
      <h3 className="text-xl font-bold mb-4">Manage Students</h3>
      <SearchBar setSearch={setSearch} />
      <DataTable
        data={students}
        columns={[
          "ID",
          "First Name",
          "Last Name",
          "Email",
          "Department",
          "Actions",
        ]}
        renderRow={(student) => (
          <tr key={student.student_id}>
            <td>{student.student_id}</td>
            <td>{student.first_name}</td>
            <td>{student.last_name}</td>
            <td>{student.email}</td>
            <td>{student.department}</td>
            <td>
              <button
                onClick={() =>
                  toggleApproval(student.student_id, student.is_approved)
                }
                className={`${
                  student.is_approved ? "bg-yellow-500" : "bg-green-500"
                } text-white px-2 py-1 mr-2`}
              >
                {student.is_approved ? "Disapprove" : "Approve"}
              </button>
              <button
                onClick={() => deleteStudent(student.student_id)}
                className="bg-red-500 text-white px-2 py-1"
              >
                Delete
              </button>
            </td>
          </tr>
        )}
      />
    </section>
  );
};

export default StudentsSection;
