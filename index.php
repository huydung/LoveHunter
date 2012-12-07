<?php
require_once('data.php');
$is_hien = false;
if( !$is_hien ) { 
	//print_r($points);
	$points = get_public_points($points);
	//echo "===========================";
	//print_r($points);
};

$action = isset($_GET['action']) ? $_GET['action'] : 'home';

if( $action === 'data' ){
  $is_hien = isset($_SESSION['is_hien']) ? $_SESSION['is_hien'] : FALSE;
  echo json_encode( $points );
  exit;
}else{
  include('header.php');
  include($action.'.php');
  include('footer.php');
  exit;
}