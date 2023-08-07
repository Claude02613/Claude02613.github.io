$('#audio-control').click(function(){
    if( $("#myVideo").prop('muted') ) 
    {
          $("#myVideo").prop('muted', false);
          $(this).text('Mute');
    } 
    
    else 
    {
      $("#myVideo").prop('muted', true);

      $(this).text('Unmute');
    }
});