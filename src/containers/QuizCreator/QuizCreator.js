import React, {Component} from "react";
import classes from "./QuizCreator.css";
import Button from "../../components/UI/Button/Button";
import {createControl, validate, validateForm} from "../../form/formFramework";
import Input from "../../components/UI/Input/Input";
import Select from "../../components/UI/Select/Select";

function createOptionControl(number) {
    return createControl({
        label: `Answer ${number}`,
        errorMessage: "The option can't be empty",
        id: number,
    }, {required: true})
}

function createFormControl() {
    return {
        question: createControl({
            label: 'Enter the question',
            errorMessage: "The question can't be empty"
        }, {required: true}),
        option1: createOptionControl(1),
        option2: createOptionControl(2),
        option3: createOptionControl(3),
        option4: createOptionControl(4),
    }
}

class QuizCreator extends Component {
    state = {
        rightAnswerID: 1,
        quiz: [],
        isFormValid: false,
        formControls: createFormControl()
    }

    submitHandler = event => {
        event.preventDefault()
    }

    addQuestionHandler = event => {
        event.preventDefault()

        const quiz = this.state.quiz.concat()
        const index = quiz.length + 1

        const questionItem = {
            question: this.state.formControls.question.value,
            id: index,
            rightAnswerID: this.state.rightAnswerID,
            answers: [
                {text: this.state.formControls.option1.value, id: this.state.formControls.option1.id},
                {text: this.state.formControls.option2.value, id: this.state.formControls.option2.id},
                {text: this.state.formControls.option3.value, id: this.state.formControls.option3.id},
                {text: this.state.formControls.option4.value, id: this.state.formControls.option4.id},
            ]
        }

        quiz.push(questionItem)

        this.setState({
            quiz,
            isFormValid: false,
            rightAnswerID: 1,
            formControls: createFormControl()
        })
    }

    createQuizHandler = event => {
        event.preventDefault()

        console.log(this.state.quiz)
    }

    changeHandler(value, name) {
        const formControls = { ...this.state.formControls }
        const control = { ...formControls[name] }

        control.value = value
        control.touched = true;
        control.valid = validate(control.value, control.validation)

        formControls[name] = control

        this.setState({
            formControls,
            isFormValid: validateForm(formControls)
        })
    }

    renderControls() {
        return Object.keys(this.state.formControls).map((item, index) => {
            const control = this.state.formControls[item];
            return (
                <React.Fragment key={item + index}>
                    <Input
                        type={control.type}
                        value={control.value}
                        valid={control.valid}
                        touched={control.touched}
                        label={control.label}
                        errorMessage={control.errorMessage}
                        shouldValidate={!!control.validation}
                        onChange={event => {
                            this.changeHandler(event.target.value, item)
                        }}
                    />
                    {index === 0 ? <hr/> : null}
                </React.Fragment>
            )
        })
    }

    selectChangeHandler = event => {
        this.setState({
            rightAnswerID: event.target.value
        })
    }

    render() {
        const select = <Select
            label="Choose the correct answer"
            value={this.state.rightAnswerID}
            onChange={this.selectChangeHandler}
            options={[
                {text: 1, value: 1},
                {text: 2, value: 2},
                {text: 3, value: 3},
                {text: 4, value: 4},
            ]}
        />

        return (
            <div className={classes.QuizCreator}>
                <div>
                    <h1>QuizCreator</h1>

                    <form onSubmit={this.submitHandler} className={classes.CreatorForm}>
                        {this.renderControls()}

                        {select}

                        <Button type='primary' onClick={this.addQuestionHandler} disabled={!this.state.isFormValid}>Add question</Button>
                        <Button type='success' onClick={this.createQuizHandler} disabled={this.state.quiz.length === 0}>Create quiz</Button>
                    </form>
                </div>
            </div>
        )
    }
}

export default QuizCreator