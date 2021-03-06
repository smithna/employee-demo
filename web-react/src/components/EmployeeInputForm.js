import React from 'react'
import { gql, useMutation } from '@apollo/client'
import { withStyles } from '@material-ui/core/styles'
import { Paper, TextField, Button } from '@material-ui/core'
import Title from './Title'

const styles = (theme) => ({
  root: {
    maxWidth: 700,
    marginTop: theme.spacing(3),
    overflowX: 'auto',
    margin: 'auto',
  },
  textField: {
    margin: theme.spacing(1),
    minWidth: 300,
  },
  button: {
    margin: theme.spacing(1),
  },
})

const CREATE_EMPLOYEE = gql`
  mutation createEmployee($emp_id: Int!, $name: String!) {
    CreateEmployee(emp_id: $emp_id, name: $name) {
      emp_id
      name
    }
  }
`

const EmployeeInputForm = (props) => {
  const { classes } = props
  const [employeeName, setEmployeeName] = React.useState('')
  const [employeeId, setEmployeeId] = React.useState('')
  const [addEmployee] = useMutation(CREATE_EMPLOYEE, {
    update(cache, { data: { addEmployee } }) {
      cache.modify({
        fields: {
          employees(existingEmployees = []) {
            const newEmployeeRef = cache.writeFragment({
              data: addEmployee,
              fragment: gql`
                fragment NewEmployee on Employee {
                  emp_id
                  name
                }
              `,
            })
            return [...existingEmployees, newEmployeeRef]
          },
        },
      })
    },
  })

  const handleSubmit = (event) => {
    event.preventDefault()
    addEmployee({
      variables: {
        emp_id: employeeId,
        name: employeeName,
      },
    })
  }

  return (
    <Paper className={classes.root}>
      <Title>Create Employee</Title>
      <form onSubmit={handleSubmit} className={classes.root} autoComplete="off">
        <TextField
          id="employee_name"
          label="Employee name"
          type="text"
          variant="outlined"
          required
          className={classes.textField}
          value={employeeName}
          onChange={(e) => setEmployeeName(e.target.value)}
        />
        <TextField
          id="employee_id"
          label="Employee ID"
          type="number"
          variant="outlined"
          value={employeeId}
          required
          className={classes.textField}
          onChange={(e) => setEmployeeId(parseInt(e.target.value))}
        />
        <Button
          variant="outlined"
          color="primary"
          onClick={handleSubmit}
          className={classes.button}
        >
          Submit
        </Button>
      </form>
    </Paper>
  )
}

export default withStyles(styles)(EmployeeInputForm)
