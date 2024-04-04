import { ChangeEvent, useContext, useRef, useState } from "react";
import {
  CreateModalContext,
  CreateModalTogglerContext,
} from "../../../core/CreateStuffProvider";
import InputSelect, { InputMethod } from "./InputSelect";
import CreateStuffImage from "./CreateStuffImage";
import CreateStuffText from "./CreateStuffText";
import ModalLayout from "../../../shared/components/ModalLayout";

export default function CreateStuff() {
  const isModalShown = useContext(CreateModalContext);
  const setIsModalShown = useContext(CreateModalTogglerContext);

  const [nameFromImage, setNameFromimage] = useState<string>();
  const [existingRequestId, setExistingRequestId] = useState<string>();
  const [file, setFile] = useState<File | null>(null);
  const [method, setMethod] = useState<InputMethod>();
  const imgInputRef = useRef<HTMLInputElement | null>(null);

  const showInputSelect = isModalShown && !method;
  const showImage = isModalShown && !!file && !nameFromImage;
  const showText = method === InputMethod.TEXT || !!nameFromImage;

  function handleClose() {
    clearState();
    setIsModalShown(false);
  }

  function clearState() {
    setNameFromimage(undefined);
    setFile(null);
    setMethod(undefined);
    if (imgInputRef.current) {
      imgInputRef.current.value = "";
    }
  }

  function handleInputSelect(method: InputMethod) {
    if (method === InputMethod.IMAGE) {
      imgInputRef.current?.click();
    } else {
      setMethod(InputMethod.TEXT);
    }
  }

  function handleImageInput(e: ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.item(0);
    if (file) {
      setFile(file);
      setMethod(InputMethod.IMAGE);
    }
  }

  function handleItemSelect(id: string, item: string) {
    setExistingRequestId(id);
    setNameFromimage(item);
  }

  return (
    <>
      <ModalLayout open={showInputSelect} onClose={handleClose}>
        {showInputSelect && (
          <InputSelect onClick={handleInputSelect}></InputSelect>
        )}
      </ModalLayout>
      <ModalLayout open={showImage} onClose={handleClose}>
        {showImage && (
          <CreateStuffImage
            file={file}
            onReSelect={() => handleInputSelect(InputMethod.IMAGE)}
            onItemSelect={handleItemSelect}
          ></CreateStuffImage>
        )}
      </ModalLayout>
      <ModalLayout open={showText} onClose={handleClose} keepMounted={true}>
        {showText && (
          <CreateStuffText
            nameFromImage={nameFromImage}
            existingRequestId={existingRequestId}
            onClose={handleClose}
          ></CreateStuffText>
        )}
      </ModalLayout>
      <input
        ref={imgInputRef}
        type="file"
        id="image"
        name="image"
        accept="image/*"
        style={{ display: "none" }}
        onChange={handleImageInput}
      />
    </>
  );
}
