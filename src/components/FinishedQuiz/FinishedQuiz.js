import React from "react";
import classes from "./FinishedQuiz.css";
import Button from "../UI/Button/Button";
import {Link} from "react-router-dom";

const FinishedQuiz = props => {
    const successCount = Object.keys(props.results).reduce((total, key) => {
        if (props.results[key] === 'success') {
            total++
        }

        return total
    }, 0)

    return (
        <div className={classes.FinishedQuiz}>
            <ul>
                {props.quiz.map((question, index) => {
                    const cls = [
                        'fa',
                        props.results[question.id] === 'error' ? 'fa-times' : 'fa-check',
                        classes[props.results[question.id]]
                    ]

                    console.log(props.results)

                    return (
                        <li key={index} >
                            <strong>{index + 1}. </strong>
                            {question.question}
                            <i className={cls.join(' ')}/>
                        </li>
                    )
                })}
            </ul>

            <p>Correct {successCount} out of {props.quiz.length}</p>

            <div>
                <Button onClick={props.onRetry} type='primary'>Retry</Button>
                <Link to="/">
                    <Button type='success'>List of tests</Button>
                </Link>
            </div>
        </div>
    )
}

export default FinishedQuiz