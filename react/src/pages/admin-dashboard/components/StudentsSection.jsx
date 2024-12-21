import React, { useState, useEffect } from "react";
import { supabase } from "../../../supabase";
import SearchBar from "./SearchBar";
import DataTable from "./DataTable";

const StudentsSection = () => {
  const [students, setStudents] = useState([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    const fetchStudents = async () => {
      const { data, error } = await supabase
        .from("students")
        .select("*")
        .ilike("first_name", `%${search}%`); // Case-insensitive search
      if (!error) setStudents(data);
    };

    fetchStudents();
  }, [search]);

  const approveStudent = async (studentId) => {
    await supabase
      .from("students")
      .update({ is_approved: true })
      .eq("student_id", studentId);
    // Refresh list
    setSearch(search);
  };

  const deleteStudent = async (studentId) => {
    await supabase.from("students").delete().eq("student_id", studentId);
    // Refresh list
    setSearch(search);
  };

  return (
    <section id="students">
      <h3 className="text-xl font-bold mb-4">Manage Students</h3>
      <SearchBar search={search} setSearch={setSearch} />
      <DataTable
        data={students}
        columns={["First Name", "Last Name", "Email", "Actions"]}
        renderRow={(student) => (
          <tr key={student.student_id}>
            <td>{student.first_name}</td>
            <td>{student.last_name}</td>
            <td>{student.email}</td>
            <td>
              {!student.is_approved && (
                <button
                  onClick={() => approveStudent(student.student_id)}
                  className="bg-green-500 text-white px-2 py-1 mr-2"
                >
                  Approve
                </button>
              )}
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
