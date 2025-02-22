import * as React from "react";
import * as Yup from "yup";
import Card from "@material-ui/core/Card";
import CardHeader from "@material-ui/core/CardHeader";
import CardContent from "@material-ui/core/CardContent";
import { Formik, Form, Field } from "formik";
import { Button, Grid } from "@material-ui/core";
import { useWallet } from "@tz-contrib/react-wallet-provider";
import { createPoll } from "../contract";
import { useToasts } from "react-toast-notifications";
import { FormikTextField } from "./FormikTextField";


// async function getNextPollId() {
//   return await fetch(`https://api.${process.env.REACT_APP_NETWORK}.tzkt.io/v1/bigmaps/${process.env.REACT_APP_BIGMAP_POLLS}/keys`)
//     .then(response => response.json())
//     .then(polls => {
//       return polls.length + 1
//     });
// }

export default function CreatePollCard() {
  const { connected } = useWallet();
  const { addToast } = useToasts();
  const validationSchema = Yup.object().shape({
    // pollId: Yup.string().required("Required"),
    endDate: Yup.string().required("Required"),
    startDate: Yup.string().required("Required"),
    noOfOptions: Yup.number()
      .min(2, "Min 2 options required")
      .max(10, "Max 10 options currently supported")
      .required("Required"),
    title: Yup.string().required("Required"),
    category: Yup.string().required("Required"),
    description: Yup.string().required("Required")
  });
  // const [nextPollId, setNextPollId] = React.useState("1");
  // React.useEffect(() => {
  //   getNextPollId()
  //     .then(pollId =>{
  //       setNextPollId(pollId.toString())
  //     })
  //     .catch(err => console.error(err));
  // }, []);
  const handleSubmit = async (values: any, helper: any) => {
    if (connected) {
      try {
        let pollMetas = {
          description: values.description,
          multi: values.multi
        }
        if (pollMetas.multi === "score" ) {
          pollMetas = {...pollMetas, ...{
            opt1: "1",
            opt1desc: "",
            opt2: "2",
            opt2desc: "",
            opt3: "3",
            opt3desc: "",
            opt4: "4",
            opt4desc: "",
            opt5: "5",
            opt5desc: ""
          }}
        } else {
          pollMetas = {...pollMetas, ...{
            opt1: values.opt1,
            opt1desc: values.opt1desc,
            opt2: values.opt2,
            opt2desc: values.opt2desc,
            opt3: values.opt3,
            opt3desc: values.opt3desc,
            opt4: values.opt4,
            opt4desc: values.opt4desc,
            opt5: values.opt5,
            opt5desc: values.opt5desc,
            opt6: values.opt6,
            opt6desc: values.opt6desc,
            opt7: values.opt7,
            opt7desc: values.opt7desc,
            opt8: values.opt8,
            opt8desc: values.opt8desc,
            opt9: values.opt9,
            opt9desc: values.opt9desc,
            opt10: values.opt10,
            opt10desc: values.opt10desc
          }}
        }
        console.log([values,pollMetas])
        const hash = await createPoll( 
          values.category,
          values.endDate,
          values.multi === "score"?5:values.noOfOptions,
          values.startDate,
          values.title,
          pollMetas
        );
        if (hash) {
          addToast("Tx Submitted", {
            appearance: "success",
            autoDismiss: true,
          });
          helper.resetForm();
        }
      } catch (error) {
        console.log(error);
        const errorMessage = error?.message || error?.data[1]?.with?.string || "Tx Failed";
        addToast(errorMessage, {
          appearance: "error",
          autoDismiss: true,
        });
      }
    }
  };
  // const dateStart = new Date()
  // var dateEnd = new Date()
  // dateEnd.setDate(dateEnd.getDate() + 7)

  return (
    <Card sx={{ maxWidth: "40rem", margin: "3em auto" }}>
      <CardHeader title="Create A Poll" subheader="Start a new poll" />
      <CardContent>
        <Formik
          initialValues={{ 
            multi: "false", 
            startDate: new Date().toISOString().slice(0, 10), 
            endDate: new Date((new Date()).setDate((new Date()).getDate() + 1)).toISOString().slice(0, 10), 
            noOfOptions: 2,
            title: "",
            category: "",
            description: "",
            opt1: '',
            opt1desc: '',
            opt2: '',
            opt2desc: '',
            opt3: '',
            opt3desc: '',
            opt4: '',
            opt4desc: '',
            opt5: '',
            opt5desc: '',
            opt6: '',
            opt6desc: '',
            opt7: '',
            opt7desc: '',
            opt8: '',
            opt8desc: '',
            opt9: '',
            opt9desc: '',
            opt10: '',
            opt10desc: ''
          }}
          enableReinitialize={true}
          onSubmit={handleSubmit}
          validationSchema={validationSchema}
          validateOnBlur
          validateOnChange
        >
          {({ setFieldValue, errors, values, touched, isValid, dirty }) => (
            <Form>
              <Grid direction="column" container spacing={3}>
                <Grid item>
                  <Field
                    name="multi"
                    id="multiNo"
                    type="radio"
                    label="Multiple Options"
                    value="false"
                  />
                  <label htmlFor="multiNo">SINGLE VOTE</label>
                  &nbsp;&nbsp;&nbsp;
                  <Field
                    name="multi"
                    id="multiYes"
                    type="radio"
                    label="Multiple Options"
                    value="true"
                  />
                  <label htmlFor="multiYes">MULTIPLE CHOICE</label>
                  &nbsp;&nbsp;&nbsp;
                  <Field
                    name="multi"
                    id="multiScore"
                    type="radio"
                    label="Scored Vote"
                    value="score"
                  />
                  <label htmlFor="multiScore">SCORED VOTE</label>
                </Grid>
                <Grid item>
                  <Field
                    component={FormikTextField}
                    name="title"
                    type="text"
                    label="Title"
                    fullWidth
                  />
                </Grid>
                <Grid item>
                  <Field
                    name="description"
                    as="textarea"
                    label="Description"
                    placeholder="Description"
                    style={{width: "100%", fontSize: '1em', padding: '0.5em', resize: 'vertical'}}
                  />
                </Grid>
                <Grid container item pt={1} mt={1}>
                  <Grid item md>
                    Start Date: &nbsp;
                    <Field
                      label="Start Date"
                      name="startDate"
                      type="date"
                    />
                  </Grid>
                  <Grid item md>
                    End Date: &nbsp;
                    <Field
                      label="End Date"
                      name="endDate"
                      type="date"

                    />
                  </Grid>
                </Grid>
                <Grid container item spacing={3} pt={1} mt={1}>
                  <Grid item md>
                    <Field
                      name="category"
                      as="select"
                      style={{ padding: '16.5px 14px',
                        borderColor: 'var(--gray-50)',
                        borderRadius: '5px',
                        width: '100%'}}
                    >
                      <option value="">Select Category</option>
                      <option value="1">Proposal</option>
                      <option value="2">Question</option>
                    </Field>
                  </Grid>
                </Grid>
                { values.multi === "true" && (
                  <Grid item container className="options-wrap" spacing={2}>
                    <Grid item container direction="column" spacing={3}>
                      <Grid item xl>
                        <hr />
                        <strong>Options</strong>
                      </Grid>
                      <Grid item>
                        <Field
                          component={FormikTextField}
                          name="noOfOptions"
                          type="number"
                          label="Number of options"
                          fullWidth
                        />
                      </Grid>
                    </Grid>
                    <Grid container item className="opt1wrap">
                      <Grid lg item>
                        <Field
                          component={FormikTextField}
                          name="opt1"
                          type="text"
                          label="Title (Option 1)"
                          fullWidth
                        />
                      </Grid>
                      &nbsp;
                      <Grid lg item>
                        <Field
                          component={FormikTextField}
                          name="opt1desc"
                          as="text"
                          label="Description (Option 1)"
                          fullWidth
                        />
                      </Grid>
                    </Grid>
                    <Grid container item className="opt2wrap">
                      <Grid lg item>
                        <Field
                          component={FormikTextField}
                          name="opt2"
                          type="text"
                          label="Title (Option 2)"
                          fullWidth
                        />
                      </Grid>
                      &nbsp;
                      <Grid lg item>
                        <Field
                          component={FormikTextField}
                          name="opt2desc"
                          type="text"
                          label="Description (Option 2)"
                          fullWidth
                        />
                      </Grid>
                    </Grid>
                    { values.noOfOptions > 2 && (
                    <Grid container item className="opt3wrap">
                      <Grid lg item>
                        <Field
                          component={FormikTextField}
                          name="opt3"
                          type="text"
                          label="Title (Option 3)"
                          fullWidth
                        />
                      </Grid>
                      &nbsp;
                      <Grid lg item>
                        <Field
                          component={FormikTextField}
                          name="opt3desc"
                          type="text"
                          label="Description (Option 3)"
                          fullWidth
                        />
                      </Grid>
                    </Grid>
                    )}
                    { values.noOfOptions > 3 && (
                    <Grid container item className="opt4wrap">
                      <Grid lg item>
                        <Field
                          component={FormikTextField}
                          name="opt4"
                          type="text"
                          label="Title (Option 4)"
                          fullWidth
                        />
                      </Grid>
                      &nbsp;
                      <Grid lg item>
                        <Field
                          component={FormikTextField}
                          name="opt4desc"
                          type="text"
                          label="Description (Option 4)"
                          fullWidth
                        />
                      </Grid>
                    </Grid>
                    )}
                    { values.noOfOptions > 4 && (
                    <Grid container item className="opt5wrap">
                      <Grid lg item>
                        <Field
                          component={FormikTextField}
                          name="opt5"
                          type="text"
                          label="Title (Option 5)"
                          fullWidth
                        />
                      </Grid>
                      &nbsp;
                      <Grid lg item>
                        <Field
                          component={FormikTextField}
                          name="opt5desc"
                          type="text"
                          label="Description (Option 5)"
                          fullWidth
                        />
                      </Grid>
                    </Grid>
                    )}
                    { values.noOfOptions > 5 && (
                    <Grid container item className="opt6wrap">
                      <Grid lg item>
                        <Field
                          component={FormikTextField}
                          name="opt6"
                          type="text"
                          label="Title (Option 6)"
                          fullWidth
                        />
                      </Grid>
                      &nbsp;
                      <Grid lg item>
                        <Field
                          component={FormikTextField}
                          name="opt6desc"
                          type="text"
                          label="Description (Option 6)"
                          fullWidth
                        />
                      </Grid>
                    </Grid>
                    )}
                    { values.noOfOptions > 6 && (
                      <Grid container item className="opt7wrap">
                        <Grid lg item>
                          <Field
                            component={FormikTextField}
                            name="opt7"
                            type="text"
                            label="Title (Option 7)"
                            fullWidth
                          />
                        </Grid>
                        &nbsp;
                        <Grid lg item>
                          <Field
                            component={FormikTextField}
                            name="opt7desc"
                            type="text"
                            label="Description (Option 7)"
                            fullWidth
                          />
                        </Grid>
                      </Grid>
                    )}
                    { values.noOfOptions > 7 && (
                      <Grid container item className="opt8wrap">
                        <Grid lg item>
                          <Field
                            component={FormikTextField}
                            name="opt8"
                            type="text"
                            label="Title (Option 8)"
                            fullWidth
                          />
                        </Grid>
                        &nbsp;
                        <Grid lg item>
                          <Field
                            component={FormikTextField}
                            name="opt8desc"
                            type="text"
                            label="Description (Option 8)"
                            fullWidth
                          />
                        </Grid>
                      </Grid>
                    )}
                    { values.noOfOptions > 8 && (
                      <Grid container item className="opt9wrap">
                        <Grid lg item>
                          <Field
                            component={FormikTextField}
                            name="opt9"
                            type="text"
                            label="Title (Option 9)"
                            fullWidth
                          />
                        </Grid>
                        &nbsp;
                        <Grid lg item>
                          <Field
                            component={FormikTextField}
                            name="opt9desc"
                            type="text"
                            label="Description (Option 9)"
                            fullWidth
                          />
                        </Grid>
                      </Grid>
                    )}
                    { values.noOfOptions > 9 && (
                      <Grid container item className="opt10wrap">
                        <Grid lg item>
                          <Field
                            component={FormikTextField}
                            name="opt10"
                            type="text"
                            label="Title (Option 10)"
                            fullWidth
                          />
                        </Grid>
                        &nbsp;
                        <Grid lg item>
                          <Field
                            component={FormikTextField}
                            name="opt10desc"
                            type="text"
                            label="Description (Option 10)"
                            fullWidth
                          />
                        </Grid>
                      </Grid>
                    )}
                  </Grid>
                )}
                <Grid item>
                  <Button
                    variant="contained"
                    fullWidth
                    type="submit"
                    disabled={!connected || !isValid || !dirty}
                  >
                    Submit
                  </Button>
                </Grid>
              </Grid>
            </Form>
          )}
        </Formik>
      </CardContent>
    </Card>
  );
}
