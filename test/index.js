import React, { useState, useEffect } from "react";

const Test = () => {
  const [firstCity, setFirstCity] = useState("");
  const [secondCity, setSecondCity] = useState("");
  const [university, setUniversity] = useState([]);

  const getResult = () => {
    let result = [];
    university.forEach((element) => {
      result.push(element.data);
    });

    let a = [];

    result.forEach((element) => {
      element.forEach((element1) => {
        a.push({
          university: element1.university,
          international_students: parseInt(
            element1.international_students.replace(/[,]/g, "")
          ),
          city: element1.location.city,
        });
      });
    });

    a.sort(function (x, y) {
      return y.international_students - x.international_students;
    });

    let universityCity = "";

    for (let i = 0; i < a.length; i++) {
      if (a[i].city == firstCity) {
        universityCity = a[i].university;
        break;
      }
    }

    if (universityCity == "") {
      for (let i = 0; i < a.length; i++) {
        if (a[i].city == secondCity) {
          universityCity = a[i].university;
          break;
        }
      }
    }

    console.log(universityCity);
  };

  const fetchAll = async (totalPages) => {
    let promises = [];
    for (let i = 2; i <= totalPages; i++) {
      promises.push(
        fetch(`https://jsonmock.hackerrank.com/api/universities/?page=${i}`)
      );
    }

    const results = await Promise.all(promises);
    return Promise.all(results.map((result) => result.json()));
  };

  const fetchUniversities = async (firstCity, secondCity) => {
    try {
      const res = await fetch(
        "https://jsonmock.hackerrank.com/api/universities"
      );
      const { data, total_pages } = await res.json();
      const city = firstCity ? firstCity : secondCity
      let universities = data.filter(item => item.location.city === city)
      const result = await fetchAll(total_pages);
      result.forEach(university => {
        universities = universities.concat(university.data.filter(item => item.location.city === city))
      })

      console.log(universities)
      
      const { university } = universities.reduce((prev, cur) => {
        const prevStudents = parseInt(prev.international_students.replace(/,/g, '')) 
        const curStudents = parseInt(cur.international_students.replace(/,/g, ''))
        return prevStudents > curStudents ? prev : cur
      })

      console.log(university)
    } catch (e) {
      console.log(e);
    }
  };

  const handleResultClick = async() => {
    await fetchUniversities(firstCity, secondCity)
  }

  return (
    <div>
      <label htmlFor="firstCity">FirstCity: </label>
      <input
        type="text"
        id="firstCity"
        name="firstCity"
        value={firstCity}
        onChange={(e) => setFirstCity(e.target.value)}
      />
      <label htmlFor="secondCity">SecondCity: </label>
      <input
        type="text"
        id="secondCity"
        name="secondCity"
        value={secondCity}
        onChange={(e) => setSecondCity(e.target.value)}
      />
      <button onClick={handleResultClick}>Result</button>
    </div>
  );
};

export default Test;
