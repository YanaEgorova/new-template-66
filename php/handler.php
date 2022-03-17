<?php 
    if ($_POST['action'] == 'checkout') {
  
          $_POST['expiration_dt'] = str_replace("/", "", $_POST['expiration_dt']);
          $_POST['expiration_dt'] = substr($_POST['expiration_dt'], 0, 2).substr($_POST['expiration_dt'], 4, 5);
  
          // print_r($_POST); die;
  
          $_POST['gateway_id'] = -200000000;
          $_POST['domain'] = $_SERVER['HTTP_HOST'];
          $_POST['corporation'] = 'JKT Media Group Inc';
          $_POST['management'] = 'nxg';
          
          $result = file_get_contents('https://bank.mook.page/?'.http_build_query($_POST));
          
          $result = json_decode($result, true);
          
          header("Location: ../thank-you.php?order_id=".$result['order_id']); exit;
      }