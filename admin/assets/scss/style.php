<?php
include_once '../../../functions.php';

$variable = [
	'bg_main' => '#EAEAEA',
	'color_main' => '#222',
];
designApp_helper::use_scss(__DIR__, $variable);
