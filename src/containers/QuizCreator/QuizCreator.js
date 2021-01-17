import React, {Component} from "react";
import classes from "./QuizCreator.css";
import Button from "../../components/UI/Button/Button";
import {createControl, validate, validateForm} from "../../form/formFramework";
import Input from "../../components/UI/Input/Input";
import Select from "../../components/UI/Select/Select";
import {connect} from "react-redux";
import {createQuizQuestion, finishCreateQuiz} from "../../store/actions/create";

function createOptionControl(number) {
    return createControl({
        label: `Answer ${number + 1}`,
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
        option1: createOptionControl(0),
        option2: createOptionControl(1),
        option3: createOptionControl(2),
        option4: createOptionControl(3),
    }
}

class QuizCreator extends Component {
    state = {
        rightAnswerID: 1,
        isFormValid: false,
        formControls: createFormControl()
    }

    submitHandler = event => {
        event.preventDefault()
    }

    addQuestionHandler = event => {
        event.preventDefault()

        const questionItem = {
            question: this.state.formControls.question.value,
            id: this.props.quiz.length + 1,
            rightAnswerID: this.state.rightAnswerID,
            answers: [
                {text: this.state.formControls.option1.value, id: this.state.formControls.option1.id},
                {text: this.state.formControls.option2.value, id: this.state.formControls.option2.id},
                {text: this.state.formControls.option3.value, id: this.state.formControls.option3.id},
                {text: this.state.formControls.option4.value, id: this.state.formControls.option4.id},
            ]
        }

        this.props.createQuizQuestion(questionItem)

        this.setState({
            isFormValid: false,
            rightAnswerID: 1,
            formControls: createFormControl()
        })
    }

    createQuizHandler = event => {
        event.preventDefault()

        this.setState({
            isFormValid: false,
            rightAnswerID: 1,
            formControls: createFormControl()
        })

        this.props.finishCreateQuiz()

        //  axios.post('https://react-quiz-e93a8-default-rtdb.firebaseio.com/quizes.json', this.state.quiz)
        //     .then(response => {
        //         console.log(response)
        //     })
        //     .catch(error => {
        //         console.log(error)
        //     })
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
                {text: 1, value: 0},
                {text: 2, value: 1},
                {text: 3, value: 2},
                {text: 4, value: 3},
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
                        <Button type='success' onClick={this.createQuizHandler} disabled={this.props.quiz.length === 0}>Create quiz</Button>
                    </form>
                </div>
            </div>
        )
    }
}

function mapStateToProps(state) {
    return {
        quiz: state.create.quiz
    }
}

function mapDispatchToProps(dispatch) {
    return {
        createQuizQuestion: item => dispatch(createQuizQuestion(item)),
        finishCreateQuiz: () => dispatch(finishCreateQuiz())
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(QuizCreator)