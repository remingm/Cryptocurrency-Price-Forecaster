import React, { useState } from "react";
import * as EmailValidator from "email-validator";
import emailjs, { init } from "@emailjs/browser";
init("user_8SUqiYZQ3hQTSK8GWDtSV");

interface TemplateParams {
  email: string;
  feedback: string;
  appname: string;
}

function formSubmit(
  e: React.SyntheticEvent,
  setEmailSubmitted: React.Dispatch<React.SetStateAction<boolean>>
): void {
  const formVals = processReactEvent(e);

  const params: TemplateParams = {
    email: formVals.emailaddr !== "" ? formVals.emailaddr : "< no email given>",
    feedback: formVals.feedback,
    appname: "stonkpix",
  };

  emailjs
    .send(
      "service_3dckhyg",
      "template_938lh7g",
      params as unknown as Record<string, string>
    )
    .then(
      function (response) {
        console.log("SUCCESS!", response.status, response.text);
        setEmailSubmitted(true);
      },
      function (error) {
        console.log("FAILED...", error);
      }
    );
}

function validateEmail(
  e: React.SyntheticEvent,
  setEmailValid: React.Dispatch<React.SetStateAction<boolean>>,
  setEmailSubmitted: React.Dispatch<React.SetStateAction<boolean>>
): void {
  const formVals = processReactEvent(e);
  setEmailValid(
    EmailValidator.validate(formVals.emailaddr) ||
      formVals.emailaddr.length === 0
  );
  setEmailSubmitted(false);
}

type FormValues = {
  emailaddr: string;
  feedback: string;
};

function processReactEvent(e: React.SyntheticEvent): FormValues {
  e.preventDefault();
  console.log(e);
  const target = e.currentTarget as typeof e.currentTarget & {
    emailaddr: { value: string };
    feedback: { value: string };
  };
  return {
    emailaddr: target.emailaddr.value,
    feedback: target.feedback.value,
  };
}

function FeedbackForm() {
  const [emailValid, setEmailValid] = useState(true);
  const [emailSubmitted, setEmailSubmitted] = useState(false);

  return (
    <div className="mt-10 sm:mt-0 mx-8">
      <div className="md:grid md:grid-cols-3 md:gap-6">
        <div className="md:col-span-1">
          <div className="px-4 sm:px-0">
            <h3 className="text-lg font-large leading-6 text-gray-900">
              Feedback
            </h3>
            <p className="mt-1 text-sm text-gray-600">
              Help us improve your experience.
            </p>
          </div>
        </div>
        <div className="mt-5 md:mt-0 md:col-span-2">
          <form
            onSubmit={(e: React.SyntheticEvent) =>
              formSubmit(e, setEmailSubmitted)
            }
            onChange={(e: React.SyntheticEvent) =>
              validateEmail(e, setEmailValid, setEmailSubmitted)
            }
          >
            <div className="shadow overflow-hidden sm:rounded-md">
              <div className="px-4 py-5 bg-white sm:p-6">
                <div className="grid grid-cols-6 gap-6">
                  <div className="col-span-6 sm:col-span-4">
                    <label
                      htmlFor="emailaddr"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Email address (optional)
                    </label>
                    <input
                      type="text"
                      name="emailaddr"
                      id="emailaddr"
                      autoComplete="email"
                      className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                    />
                    {!emailValid && (
                      <p className="mt-2 text-sm text-red-500">Invalid Email</p>
                    )}
                  </div>
                  <div className="col-span-6 sm:col-span-4">
                    <label
                      htmlFor="Feedback"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Feedback
                    </label>
                    <div className="mt-1">
                      <textarea
                        id="feedback"
                        name="feedback"
                        rows={3}
                        className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border border-gray-300 rounded-md"
                        defaultValue={""}
                      />
                    </div>
                  </div>
                </div>
              </div>
              <div className="px-4 py-3 bg-gray-50 text-right sm:px-6">
                <button
                  className={
                    "inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white " +
                    (emailSubmitted
                      ? "bg-indigo-300"
                      : "bg-indigo-600 hover:bg-indigo-700") +
                    " focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                  }
                  disabled={emailSubmitted}
                >
                  {emailSubmitted ? "Success!" : "Submit"}
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
export default FeedbackForm;
