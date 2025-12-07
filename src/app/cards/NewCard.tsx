import React, { useState } from "react";
import {
  Button,
  Modal,
  ModalBody,
  hubspot,
  Input,
  Form,
  CrmContext,
  CrmHostActions,
  UiePlatformActions,
} from "@hubspot/ui-extensions";

hubspot.extend<"crm.record.sidebar">(({ context, actions }) => (
  <Extension context={context} actions={actions} />
));

const Extension = ({ context, actions }: { context: CrmContext; actions: CrmHostActions & UiePlatformActions }) => {
  const [message, setMessage] = useState<string>("");
  const [isDisabled, setIsDisabled] = useState(true);
  const [validationMessage, setValidationMessage] = useState("");

  const submitHandler = async (contactId: any) => {
    try {
      const response = await hubspot.fetch(
        "https://rehearsable-unintrusively-cletus.ngrok-free.dev",
        { method: "POST", body: { message, contactId } }
      );
      console.log(response);
      actions.closeOverlay("default-modal");
    } catch (error) {
      console.log(error);
      actions.closeOverlay("default-modal");
    }
  };

  const userId = context.crm.objectId;

  return (
    <>
      <Button
        variant="primary"
        overlay={
          <Modal id="default-modal" title="Example modal" width="md">
            <ModalBody>
              <Form
                onSubmit={async () => {
                  await submitHandler(userId);
                }}
              >
                <Input
                  label="Enter message"
                  name="message"
                  placeholder="write something here"
                  required={true}
                  onChange={(value) => setMessage(value)}
                  onInput={(value) => {
                    if (value == "") {
                      setValidationMessage("Message is required");
                      setIsDisabled(true);
                    } else {
                      setIsDisabled(false);
                    }
                  }}
                  error={!!validationMessage}
                  validationMessage={validationMessage}
                />
                <Button variant="primary" type="submit" disabled={isDisabled}>
                  Send
                </Button>
              </Form>
            </ModalBody>
          </Modal>
        }
      >
        Click Me
      </Button>
    </>
  );
};
