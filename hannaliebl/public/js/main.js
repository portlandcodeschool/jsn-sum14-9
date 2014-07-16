$(function () {
  $('#submit-application').click(function() {
    var applicationData = {},
        $jobTitle = $('#title'),
        $company = $('#company');
    if ($('#applied-to').prop('checked')) {
      var appliedTo = true;
    } else {
      var appliedTo = false;
    }
    applicationData.jobTitle = $jobTitle.val();
    applicationData.company = $company.val();
    applicationData.appliedTo = appliedTo;

    if (((/\S|^$/.test(applicationData.jobTitle)) && (applicationData.jobTitle !== '')) && ((/\S|^$/.test(applicationData.company)) && (applicationData.company !== ''))) { 
      $('.warning').addClass('hidden');
      $.post('/', applicationData, function (response) {
        console.log('heeey',response);
      });
    } else {
      $('.warning').removeClass('hidden');
    }
  });
});