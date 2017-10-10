<?php
class MyDB extends SQLite3 {
    function __construct() {
        $this->open('/data/seen.db');
        $this->exec('CREATE TABLE IF NOT EXISTS seen (asin TEXT PRIMARY KEY)');
    }
}

$db= new MyDB();

function getAsin( $sName ) {
    if ( empty($_REQUEST[$sName]) ) return null;
    $sAsin= $_REQUEST[$sName];
    if ( preg_match('/^[A-Z0-9]{10}$/', $sAsin) ) return $sAsin;

    die("Wrong format '$sAsin'");
}

$sAsin= getAsin('add');
if ( !empty($sAsin) ) {
    $stmt= $db->prepare('INSERT INTO seen (asin) VALUES (:asin)');
    $stmt->bindValue(':asin', $sAsin, SQLITE3_TEXT);
    $stmt->execute();
}

$sAsin= getAsin('del');
if ( !empty($sAsin) ) {
    $stmt= $db->prepare('DELETE FROM seen WHERE asin = :asin');
    $stmt->bindValue(':asin', $sAsin, SQLITE3_TEXT);
    $stmt->execute();
}



$aResult= array();
$ret = $db->query('SELECT * FROM seen');
while($row = $ret->fetchArray(SQLITE3_ASSOC) ){
    $aResult[]= $row['asin'];
}

print json_encode($aResult);

