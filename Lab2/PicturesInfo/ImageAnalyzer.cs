using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Drawing;

namespace PicturesInfo
{
    public struct ImageInfo
    {
        public string CompressionType { get; set; }
        public int Width { get; set; }
        public int Height { get; set; }
        public float DpiX { get; set; }
        public float DpiY { get; set; }
        public string AdditionalInfo { get; set; }
    }
    class ImageAnalyzer
    {
        private static Dictionary<int, string> compressionTypes = new Dictionary<int, string>() { 
            { 1, "No compression" } ,
            { 2, "CCITT Group 3" } ,
            { 3, "Facsimile-compatible CCITT Group 3" } ,
            { 4, "CCITT Group 4 (T.6)" } ,
            { 5, "LZW" } 
        };

        public ImageInfo GetImageInfo(Image image)
        {
            ImageInfo imageInfo = new ImageInfo();
            imageInfo.Width = image.Width;
            imageInfo.Height = image.Height;
            imageInfo.DpiX = image.HorizontalResolution;
            imageInfo.DpiY = image.VerticalResolution;
            imageInfo.CompressionType = GetCompression(image);
            return imageInfo;
        }

        private static String GetCompression(Image image)
        {
            if (image.PropertyIdList.Contains(0x0103))
            {
                var compressionTag = image.GetPropertyItem(0x0103);
                int type = BitConverter.ToInt16(compressionTag.Value, 0);
                if (compressionTypes.ContainsKey(type))
                {
                    return compressionTypes[type];
                }
            }
            return "Unknown";
        }
    }
}
