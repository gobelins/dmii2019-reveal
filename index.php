

<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <title>Creative Boilerplate</title>
    
    <!-- Webpack Includes -->
    <link rel="stylesheet" href="build/styles.css">
    <script>        
        <?php

        $client_id = 'f146f63757b44ae0a45a0256458b211d';
        $client_secret = 'fe78d554fdd74027bad0c0d98467ca4a';

        $ch = curl_init();
        curl_setopt($ch, CURLOPT_URL,            'https://accounts.spotify.com/api/token' );
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1 );
        curl_setopt($ch, CURLOPT_POST,           1 );
        curl_setopt($ch, CURLOPT_POSTFIELDS,     'grant_type=client_credentials' );
        curl_setopt($ch, CURLOPT_HTTPHEADER,     array('Authorization: Basic '.base64_encode($client_id.':'.$client_secret)));

        $access_token = curl_exec($ch);
        ?>

        const ACCESS_TOKEN = JSON.parse('<?php echo $access_token; ?>')

        localStorage.setItem("ACCESS_TOKEN", ACCESS_TOKEN.access_token);
    </script>
</head>

<body>
    <div id="three-container"></div>
    <!-- Webpack Includes -->
    <script src="build/bundle.js"></script>
</body>

</html>