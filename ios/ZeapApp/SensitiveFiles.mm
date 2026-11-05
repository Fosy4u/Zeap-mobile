#import <React/RCTBridgeModule.h>

@interface SensitiveFiles : NSObject <RCTBridgeModule>
@end
@implementation SensitiveFiles
RCT_EXPORT_MODULE();
+ (BOOL)requiresMainQueueSetup { return NO; }
- (NSString *)directory {
  return [NSSearchPathForDirectoriesInDomains(NSCachesDirectory, NSUserDomainMask, YES).firstObject stringByAppendingPathComponent:@"zeap-sensitive"];
}
RCT_REMAP_METHOD(stage, stage:(NSString *)uri resolver:(RCTPromiseResolveBlock)resolve rejecter:(RCTPromiseRejectBlock)reject) {
  NSFileManager *manager = NSFileManager.defaultManager;
  NSError *error = nil;
  NSString *directory = [self directory];
  [manager createDirectoryAtPath:directory withIntermediateDirectories:YES attributes:@{NSFileProtectionKey:NSFileProtectionComplete} error:&error];
  NSURL *source = [NSURL URLWithString:uri];
  NSString *target = [directory stringByAppendingPathComponent:NSUUID.UUID.UUIDString];
  if (error || !source.isFileURL || ![manager copyItemAtPath:source.path toPath:target error:&error]) {
    [manager removeItemAtPath:target error:nil];
    reject(@"STAGE_FAILED", @"Unable to prepare document", nil); return;
  }
  [manager setAttributes:@{NSFileProtectionKey:NSFileProtectionComplete} ofItemAtPath:target error:&error];
  if (error) { [manager removeItemAtPath:target error:nil]; reject(@"STAGE_FAILED", @"Unable to protect document", nil); return; }
  NSString *path = source.path.stringByResolvingSymlinksInPath;
  NSString *cache = NSSearchPathForDirectoriesInDomains(NSCachesDirectory, NSUserDomainMask, YES).firstObject;
  if ([path hasPrefix:[cache stringByAppendingString:@"/"]] || [path hasPrefix:NSTemporaryDirectory()]) [manager removeItemAtPath:path error:nil];
  resolve([NSURL fileURLWithPath:target].absoluteString);
}
RCT_REMAP_METHOD(remove, remove:(NSString *)uri resolver:(RCTPromiseResolveBlock)resolve rejecter:(RCTPromiseRejectBlock)reject) {
  NSString *path = [NSURL URLWithString:uri].path.stringByResolvingSymlinksInPath;
  if (![path hasPrefix:[[self directory].stringByResolvingSymlinksInPath stringByAppendingString:@"/"]]) { reject(@"CLEANUP_FAILED", @"Invalid document path", nil); return; }
  NSError *error = nil;
  if ([NSFileManager.defaultManager fileExistsAtPath:path]) [NSFileManager.defaultManager removeItemAtPath:path error:&error];
  if (error) reject(@"CLEANUP_FAILED", @"Unable to remove document", nil); else resolve(nil);
}
RCT_REMAP_METHOD(clear, clearWithResolver:(RCTPromiseResolveBlock)resolve rejecter:(RCTPromiseRejectBlock)reject) {
  NSError *error = nil;
  if ([NSFileManager.defaultManager fileExistsAtPath:[self directory]]) [NSFileManager.defaultManager removeItemAtPath:[self directory] error:&error];
  if (error) reject(@"CLEANUP_FAILED", @"Unable to clear documents", nil); else resolve(nil);
}
@end
