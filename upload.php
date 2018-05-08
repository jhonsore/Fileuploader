<?php
$file = $_POST['fileuploadername'];//we receive by post the file name
foreach ($_FILES[$file]["error"] as $key => $error) {
  if ($error == UPLOAD_ERR_OK) {
    $name = $_FILES[$file]["name"][$key];
    move_uploaded_file( $_FILES[$file]["tmp_name"][$key], "uploads/" . $_FILES[$file]['name'][$key]);
  }
}

echo "Successfully Uploaded Images";

?>
