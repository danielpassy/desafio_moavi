from django.db import models


# Create your models here.
class FileUploadRegister(models.Model):
    file = models.FileField(upload_to="csv_files/")
    uploaded_at = models.DateTimeField(auto_now_add=True)
    number_of_entries = models.IntegerField()

    def __str__(self):
        return str(self.file)


class ShiftRegister(models.Model):
    file = models.ForeignKey(FileUploadRegister, on_delete=models.DO_NOTHING)
    matricula_colaborador = models.TextField()
    timestamp = models.DateTimeField()
