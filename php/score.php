<?php  

$bdd="ovni";
 
$connection = mysql_connect("localhost","root","");
// test la connection
if ( ! $connection )
  die ("connection impossible");
  // Connecte la base
  mysql_select_db($bdd) or die ("pas de connection");
  
  $query="INSERT INTO highscore(pseudo, score) VALUES('".$_GET['pseudo']."', '".$_GET['score']."')";
  mysql_query($query,$connection);
  
  $query="SELECT pseudo, score from highscore ORDER BY score DESC LIMIT 0,10 "; 
  $result = mysql_query($query,$connection); 

	// Vérification du résultat
   if (!$result) {
      $message  = 'Requête invalide : ' . mysql_error() . "\n";
      $message .= 'Requête complète : ' . $query;
      die($message);
   }
   
   $highScore = array();
   while($score = mysql_fetch_assoc($result))
   {
		$highScore[] = $score;
   }
   
   $query="SELECT count(*) position FROM highscore WHERE score > '".$_GET['score']."'ORDER BY score DESC";
   $result = mysql_query($query,$connection);
   $highScore[] = mysql_fetch_assoc($result);
  
   echo json_encode($highScore);
   
	exit();
?>