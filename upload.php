<?php

foreach ($_FILES["files"]["error"] as $key => $error) {
  if ($error == UPLOAD_ERR_OK) {
    $name = $_FILES["files"]["name"][$key];
    move_uploaded_file( $_FILES["files"]["tmp_name"][$key], "uploads/" . $_FILES['files']['name'][$key]);
  }
}

echo "Successfully Uploaded Images";

?>
