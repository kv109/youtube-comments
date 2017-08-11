module.exports = (comment) => {
  const html = `
   <div class="comment-renderer">
   <a href="${comment.authorChannelUrl}" class=" g-hovercard yt-uix-sessionlink"><span class="video-thumb comment-author-thumbnail yt-thumb yt-thumb-48">
   <span class="yt-thumb-square">
   <span class="yt-thumb-clip">
   <img src="${comment.authorProfileImageUrl}" height="48" width="48" role="img">
   <span class="vertical-align"></span>
   </span>
   </span>
   </span>
   </a>
   <div class="comment-simplebox-edit">
   </div>
   <div class="comment-renderer-content">
      <div class="comment-renderer-header">
        <a href="/channel/UC1zZXw9vvdOdGsF6kNCkpdg" class="comment-author-text g-hovercard yt-uix-sessionlink">${comment.authorDisplayName}</a><span class="comment-renderer-time" tabindex="0"><a href="/watch?v=wVhJ_d4JrbY&amp;lc=z22cffqgqpn2zrlh404t1aokglxbppurnwj0zzxa4nh2bk0h00410" class="yt-uix-sessionlink">1 day ago</a></span></div>
      <div class="comment-renderer-text" tabindex="0" role="article">
         <div class="comment-renderer-text-content">${comment.textDisplay}</div>
         <div class="comment-text-toggle hid">
            <div class="comment-text-toggle-link read-more"><button class="yt-uix-button yt-uix-button-size-default yt-uix-button-link" type="button" onclick="return false;"><span class="yt-uix-button-content">Read more
               </span></button>
            </div>
            <div class="comment-text-toggle-link show-less hid"><button class="yt-uix-button yt-uix-button-size-default yt-uix-button-link" type="button" onclick="return false;"><span class="yt-uix-button-content">Show less
               </span></button>
            </div>
         </div>
      </div>
      <div class="comment-renderer-footer">
         <div class="comment-action-buttons-toolbar">
            <button class="yt-uix-button yt-uix-button-size-small yt-uix-button-link comment-renderer-reply comment-simplebox-trigger" type="button" onclick=";return false;"><span class="yt-uix-button-content">Reply</span></button>
            <span class="comment-renderer-like-count ${comment.likeCount > 1 ? "off" : "on"}">${comment.likeCount}</span>
            <span role="radiogroup">
            <button class="yt-uix-button yt-uix-button-size-default yt-uix-button-default yt-uix-button-empty yt-uix-button-has-icon no-icon-markup comment-action-buttons-renderer-thumb yt-uix-sessionlink sprite-comment-actions sprite-like i-a-v-sprite-like" type="button" onclick=";return false;" role="radio" aria-label="Like" aria-checked="false"></button>
            <button class="yt-uix-button yt-uix-button-size-default yt-uix-button-default yt-uix-button-empty yt-uix-button-has-icon no-icon-markup comment-action-buttons-renderer-thumb yt-uix-sessionlink sprite-comment-actions sprite-dislike i-a-v-sprite-dislike" type="button" onclick=";return false;" role="radio" aria-label="Dislike" aria-checked="false"></button>
            </span>
            <div class="yt-uix-menu-container comment-renderer-action-menu yt-section-hover-container">
               <div class="yt-uix-menu yt-uix-menu-flipped hide-until-delayloaded">
                  <div class="yt-uix-menu-content yt-ui-menu-content yt-uix-menu-content-hidden" role="menu">
                     <ul>
                        <li role="menuitem">
                           <div class="service-endpoint-action-container hid">
                           </div>
                           <button type="button" class="yt-ui-menu-item yt-uix-menu-close-on-select  report-form-modal-renderer" data-url="/flag_service_ajax?action_get_report_form=1" data-params="GjV6MjJjZmZxZ3FwbjJ6cmxoNDA0dDFhb2tnbHhicHB1cm53ajB6enhhNG5oMmJrMGgwMDQxMCgBMgZMeWZyYW46YwgBEAIaNXoyMmNmZnFncXBuMnpybGg0MDR0MWFva2dseGJwcHVybndqMHp6eGE0bmgyYmswaDAwNDEwKgt3VmhKX2Q0SnJiWTAAShUxMTU5MDk4OTI3MzM3MDg1MzU0MzVQAA%3D%3D" data-innertube-clicktracking="CKABELZ1IhMI_4e4tuW91QIVkzCbCh1XVwn4">
                           <span class="yt-ui-menu-item-label">Report spam or abuse</span>
                           </button>
                        </li>
                     </ul>
                  </div>
               </div>
            </div>
         </div>
         <div class="comment-renderer-replybox" id="comment-simplebox-reply-z22cffqgqpn2zrlh404t1aokglxbppurnwj0zzxa4nh2bk0h00410">
            <span class="video-thumb comment-author-thumbnail yt-thumb yt-thumb-32">
            <span class="yt-thumb-square">
            <span class="yt-thumb-clip">
            <img src="https://yt3.ggpht.com/-UcCz1QHNb6U/AAAAAAAAAAI/AAAAAAAAAAA/bd_c_sVmIIA/s108-c-k-no-mo-rj-c0xffffff/photo.jpg" data-ytimg="1" tabindex="0" onload=";window.__ytRIL &amp;&amp; __ytRIL(this)" height="32" width="32" role="img" alt="${comment.authorDisplayName}">
            <span class="vertical-align"></span>
            </span>
            </span>
            </span>
         </div>
      </div>
   </div>
</div>
<br />
  `;
  return html;
};
