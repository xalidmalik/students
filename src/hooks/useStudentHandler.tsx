import { useEffect, useState } from "react";
import { getAvarage, getFullname } from "utils/helper";
import { searchName, searchTag } from "utils/search";
import { StudentType } from "utils/types";

const url = "https://api.hatchways.io/assessment/students";

export const useStudentHandler = ({
  tag,
  name,
}: {
  tag: string;
  name: string;
}) => {
  const [students, setStudents] = useState<StudentType[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<any>();
  const [result, setResult] = useState<StudentType[]>([]);

  useEffect(() => {
    setIsLoading(true);
    fetch(url)
      .then((response) => response.json())
      .then(({ students }: { students: StudentType[] }) => {
        setStudents(
          students.map((data) => {
            return {
              ...data,
              tags: [],
              avarage: getAvarage(data.grades),
              fullName: getFullname(data.firstName, data.lastName),
            };
          })
        );
        setIsLoading(false);
      })
      .catch((error) => setError(error));
  }, []);

  useEffect(() => {
    if (students.length !== 0) {
      setIsLoading(true);
      const searched = searchName(name, students);
      const finded = searchTag(tag, searched);
      setResult(finded);
      setIsLoading(false);
    }
  }, [students, name, tag]);

  return { students, result, isLoading, error, setStudents };
};
