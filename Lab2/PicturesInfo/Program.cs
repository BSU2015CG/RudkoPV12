using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Drawing;
using System.IO;
using System.Diagnostics;
using System.Windows.Media.Imaging;
using System.Xml;
using System.Xml.XPath;
using System.Xml.Xsl;

namespace PicturesInfo
{
    class Program
    {
        private static string[] supported = new string[]{
            "jpg",
            "png",
            "tif",
            "bmp",
            "gif"
        };

        static void Main(string[] args)
        {
            string directory, reportPath, xmlPath;
            directory = args.Length > 0 ? args[0] : "";
            reportPath = args.Length > 1 ? args[1] : "";
            xmlPath = reportPath + "report.xml";

            ImageAnalyzer analyzer = new ImageAnalyzer();
            var files = Directory.EnumerateFiles(directory, "*.*", SearchOption.AllDirectories).Where(f => supported.Any(s => f.EndsWith(s)));

            var watch = Stopwatch.StartNew();
            using (XmlTextWriter writer = new XmlTextWriter(xmlPath, null))
            {
                writer.Formatting = Formatting.Indented;
                writer.Indentation = 4;
                writer.WriteStartElement("pictures");
                foreach (string filename in files) {
                    ImageInfo info = analyzer.GetImageInfo(Image.FromStream(new FileStream(filename, FileMode.Open), false, false));
                    writer.WriteStartElement("picture");
                    writer.WriteElementString("name", filename);
                    writer.WriteElementString("width", info.Width.ToString());
                    writer.WriteElementString("height", info.Height.ToString());
                    writer.WriteElementString("dpi-x", info.DpiX.ToString());
                    writer.WriteElementString("dpi-y", info.DpiY.ToString());
                    writer.WriteElementString("compression", info.CompressionType);
                    writer.WriteEndElement();
                }
                writer.WriteEndElement();
            }
            watch.Stop();

            XPathDocument xpathDocument = new XPathDocument(xmlPath);
            XslCompiledTransform xslTransform = new XslCompiledTransform();
            xslTransform.Load("style.xslt");
            XmlTextWriter myWriter = new XmlTextWriter(reportPath + "report.html", null);
            xslTransform.Transform(xpathDocument, null, myWriter);
            myWriter.Close();

            Console.WriteLine("Time elapsed: " + watch.ElapsedMilliseconds / 1000);
        }
    }
}
