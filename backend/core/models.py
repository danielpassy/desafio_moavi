from django.db import models


class FileUploadRecord(models.Model):
    file = models.FileField(upload_to="csv_files/")
    uploaded_at = models.DateTimeField(auto_now_add=True)
    number_of_entries = models.IntegerField()

    def __str__(self):
        return str(self.file)


class EscalaRecord(models.Model):
    file = models.ForeignKey(FileUploadRecord, on_delete=models.DO_NOTHING)
    matricula_colaborador = models.TextField()
    timestamp = models.DateTimeField()
