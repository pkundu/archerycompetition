import React, { useState } from "react";
import data from "../data.js";

function Entry(props) {
  const [roundNumber, setRoundNumber] = useState(1);
  const [result, setResult] = useState(data);
  const [points, setPoints] = useState({ "A": 5, "B": 4, "C": 3, "D": 2, "E": 1, "F": 0 });
  const [winner, setWinner] = useState({ name: null, score: 0 });


  function onPlayerScore(team, player, event) {
    for (const [key, value] of Object.entries(points)) {
      if (key === event.target.value) {
        player.scores.push(value);
        team.teamtotalscore += value;
      }
      setResult({ ...result });
    }
  }

  function onRoundComplete(e) {
    e.preventDefault();
    let maxValue = 0;
    for (let i = 0; i < result.teams.length; i++) {
      if(getBonus(result.teams[i], roundNumber) > 0 ){
          result.teams[i].teamtotalscore += 2;
      }
      if (result.teams[i].teamtotalscore > maxValue && result.teams[i].teamtotalscore > 60) {
        maxValue = result.teams[i].teamtotalscore;
        setWinner({ name: result.teams[i].name, score: result.teams[i].teamtotalscore });
      }
    }
    setRoundNumber(roundNumber + 1);
    Object.keys(points).map(key => points[key] += 1)
    result.lastCompletedRound = roundNumber;

    setPoints({ ...points });
    console.log(result);
  }

  function getBonus(team, round){
    console.log("inside getBonus");
      let score1 = team.players[0].scores;
      let score2 = team.players[1].scores;
      if ((score1.length === score2.length) && (score1[(round-1)] === score2[(round-1)])){ 
        team.bonus = team.bonus + 2;
        console.log("getting bonus" + team.bonus);
        return team.bonus;
      } 
  }

  function getCircle(x) {
    for (const [circle, point] of Object.entries(points)) {
      if (point === x) return circle;
    }
  }

  return (
    <>
      {winner.name === null ?
        <form>
          <div>
            {result.teams.map(team => (
              <div key={team.key}>
                <h4>Total Bonus: {team.bonus}</h4>
                <h3> Enter Score for Round {roundNumber}</h3>
                {team.players.map((player, index) => (
                  <div className="form" key={player.key}>
                    <label className="archerName">{player.name}: </label>
                    <input onChange={(e) => onPlayerScore(team, player, e)}
                      type="text"
                      placeholder="Enter A,B,C,D,E,F"
                      value={(player.scores[(roundNumber - 1)] === null || player.scores[(roundNumber - 1)] === undefined) ? '' : getCircle(player.scores[(roundNumber - 1)])} />
                  </div>
                ))}
              </div>
            ))}
          </div>
          <br />
          <button onClick={onRoundComplete}>Submit Round{roundNumber} Score</button>
        </form>
        :
        <div><h2> Winner is {winner.name}</h2> <h4>with a total score {winner.score}</h4> </div>}
    </>
  )
}

export default Entry;
