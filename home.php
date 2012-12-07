<div id="header" class="container">
<h1>Love Hunter</h1>
<p><em class="description">Drag the heart around. Middle click to center the heart on the map. <br/>When it's near to one of the special places in our love-life,
 it'll change its shape. <br/>If it's close enough, treasure will be unlock. Try to find them all, my love!</em>
 </p>
</div>
<div id="body" class="container clearfix">
  
  <div class="clearfix">
    
    <div class="column" id="map_column">
      <div id="map_canvas"></div>
      <strong id="heart_status"></strong>
    </div>
    <div class="column" id="list_column">
      
      <ol id="treasures">
        <?php
          foreach( $points as $key => $point):
        ?>
        
        <?php if( $is_hien ): ?>
        <li id="point-<?php echo $key ?>" class="locked treasure">Item Locked. Try to find me on the map!</li>
        <?php else: ?>
        <li id="point-<?php echo $key ?>" class="locked treasure"><?php echo $point['address']; ?></li>
        <?php endif; ?>
        
        <?php    
          endforeach;
        ?>
      </ol>
    </div>
  
  </div>
  
</div>
<footer class="container clearfix">
  
  <?php if( !$is_hien ) {
    echo '<br/><small>Looks like you\'re a guest :) Feel free to browse the <a href="https://github.com/huydung/LoveHunter" target="_blank">source code</a>, or go directly to the <a href="index.php?action=video" target="_blank">"final-special-treasure"</a>!</small>';
  } else {
    echo '<em><small>For our 4th love anniversary, emxinhdep. I love you.</small></em>';
  }?>

</footer>
