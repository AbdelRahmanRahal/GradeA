import React, { useState, useEffect } from "react";
import { supabase } from "../../../supabase";
import { toast } from "react-toastify";
import SearchBar from "./SearchBar";
import DataTable from "./DataTable";

const ProfessorsSection = () => {
  const [professors, setProfessors] = useState([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    const fetchProfessors = async () => {
      const query = supabase.from("professors").select("*");
      if (search) {
        query.or(
          `first_name.ilike.%${search}%,last_name.ilike.%${search}%,professor_id.ilike.%${search}%`
        );
      }
      const { data, error } = await query;
      if (!error) setProfessors(data);
    };
    fetchProfessors();
  }, [search]);

  const toggleApproval = async (professorId, isApproved) => {
    const { error } = await supabase
      .from("professors")
      .update({ is_approved: !isApproved })
      .eq("professor_id", professorId);

    if (error) {
      toast.error("Failed to update approval status.");
    } else {
      toast.success(isApproved ? "Professor disapproved." : "Professor approved.");
      setSearch(search);
    }
  };

  const deleteProfessor = async (professorId) => {
    await supabase.from("professors").delete().eq("professor_id", professorId);
    setSearch(search);
  };

  const deleteStudent = async (professorId) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this user?");
    if (!confirmDelete) return;

    const { error } = await supabase.from("professors").delete().eq("professor_id", professorId);
    if (error) {
      console.log(error);
      toast.error("Failed to delete professor.");
    } else {
      toast.success("Professor deleted.");
      setSearch(search);
    }
  };

  return (
    <section id="professors" className="mt-8">
      <h3 className="text-xl font-bold mb-4">Manage Professors</h3>
      <SearchBar search={search} setSearch={setSearch} />
      <DataTable
        data={professors}
        columns={["ID", "First Name", "Last Name", "Email", "Departments", "Actions"]}
        renderRow={(professor) => (
          <tr key={professor.professor_id}>
            <td>{professor.professor_id}</td>
            <td>{professor.first_name}</td>
            <td>{professor.last_name}</td>
            <td>{professor.email}</td>
            <td>{professor.departments.join(", ")}</td>
            <td>
            <button
                onClick={() => toggleApproval(professor.professor_id, professor.is_approved)}
                className={`${
                  professor.is_approved ? "bg-yellow-500" : "bg-green-500"
                } text-white px-2 py-1 mr-2`}
              >
                {professor.is_approved ? "Disapprove" : "Approve"}
              </button>
              <button
                onClick={() => deleteProfessor(professor.professor_id)}
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

export default ProfessorsSection;