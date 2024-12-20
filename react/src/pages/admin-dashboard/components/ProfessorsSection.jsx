import React, { useState, useEffect } from "react";
import { supabase } from "../../../supabase";
import SearchBar from "./SearchBar";
import DataTable from "./DataTable";

const ProfessorsSection = () => {
  const [professors, setProfessors] = useState([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    const fetchProfessors = async () => {
      const { data, error } = await supabase
        .from("professors")
        .select("*")
        .ilike("last_name", `%${search}%`); // Case-insensitive search
      if (!error) setProfessors(data);
    };

    fetchProfessors();
  }, [search]);

  const approveProfessor = async (professorId) => {
    await supabase
      .from("professors")
      .update({ is_approved: true })
      .eq("professor_id", professorId);
    setSearch(search);
  };

  const deleteProfessor = async (professorId) => {
    await supabase.from("professors").delete().eq("professor_id", professorId);
    setSearch(search);
  };

  return (
    <section id="professors" className="mt-8">
      <h3 className="text-xl font-bold mb-4">Manage Professors</h3>
      <SearchBar search={search} setSearch={setSearch} />
      <DataTable
        data={professors}
        columns={["First Name", "Last Name", "Email", "Actions"]}
        renderRow={(professor) => (
          <tr key={professor.professor_id}>
            <td>{professor.first_name}</td>
            <td>{professor.last_name}</td>
            <td>{professor.email}</td>
            <td>
              {!professor.is_approved && (
                <button
                  onClick={() => approveProfessor(professor.professor_id)}
                  className="bg-green-500 text-white px-2 py-1 mr-2"
                >
                  Approve
                </button>
              )}
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